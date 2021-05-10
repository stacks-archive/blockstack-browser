import {
  StacksTransaction,
  deserializeCV,
  PostCondition,
  makeContractCall,
  makeContractDeploy,
  makeSTXTokenTransfer,
  TransactionVersion,
  BufferReader,
  deserializePostCondition,
  getAddressFromPrivateKey,
  broadcastRawTransaction,
  AuthType,
} from '@stacks/transactions';
import {
  ContractDeployPayload,
  ContractCallPayload,
  STXTransferPayload,
  TransactionPayload,
  TransactionTypes,
} from '@stacks/connect';
import { getPublicKeyFromPrivate } from '@stacks/encryption';
import BN from 'bn.js';
import { StacksMainnet, StacksTestnet } from '@stacks/network';
import { TokenVerifier, decodeToken } from 'jsontokens';
import { Wallet, getAppPrivateKey } from '@stacks/wallet-sdk';
import type { TxResult } from '@extension/message-types';
import type { TransactionPayloadWithAttachment } from '@store/transaction';

const getPostConditions = (
  postConditions?: (PostCondition | string)[]
): PostCondition[] | undefined => {
  return postConditions?.map(postCondition => {
    if (typeof postCondition === 'string') {
      const reader = BufferReader.fromBuffer(Buffer.from(postCondition, 'hex'));
      return deserializePostCondition(reader);
    }
    if ('amount' in postCondition && postCondition.amount) {
      return {
        ...postCondition,
        amount: new BN(postCondition.amount, 16),
      };
    }
    return postCondition;
  });
};

export const generateContractCallTx = ({
  txData,
  senderKey,
  nonce,
}: {
  txData: ContractCallPayload;
  senderKey: string;
  nonce?: number;
}) => {
  const { contractName, contractAddress, functionName, functionArgs, sponsored } = txData;
  const args = functionArgs.map(arg => {
    return deserializeCV(Buffer.from(arg, 'hex'));
  });

  return makeContractCall({
    contractName,
    contractAddress,
    functionName,
    senderKey,
    functionArgs: args,
    nonce: nonce !== undefined ? new BN(nonce, 10) : undefined,
    postConditionMode: txData.postConditionMode,
    postConditions: getPostConditions(txData.postConditions),
    network: txData.network,
    sponsored,
  });
};

export const generateContractDeployTx = ({
  txData,
  senderKey,
  nonce,
}: {
  txData: ContractDeployPayload;
  senderKey: string;
  nonce?: number;
}) => {
  const { contractName, codeBody } = txData;

  return makeContractDeploy({
    contractName,
    codeBody,
    nonce: nonce !== undefined ? new BN(nonce, 10) : undefined,
    senderKey,
    postConditionMode: txData.postConditionMode,
    postConditions: getPostConditions(txData.postConditions),
    network: txData.network,
  });
};

export const generateSTXTransferTx = ({
  txData,
  senderKey,
  nonce,
}: {
  txData: STXTransferPayload;
  senderKey: string;
  nonce?: number;
}) => {
  const { recipient, memo, amount } = txData;

  return makeSTXTokenTransfer({
    recipient,
    memo,
    senderKey,
    amount: new BN(amount),
    nonce: nonce !== undefined ? new BN(nonce, 10) : undefined,
    network: txData.network,
  });
};

export const generateTransaction = async ({
  txData,
  senderKey,
  nonce,
}: {
  senderKey: string;
  nonce?: number;
  txData: TransactionPayload;
}) => {
  let tx: StacksTransaction | null = null;
  if (!txData.network?.getTransferFeeEstimateApiUrl) {
    const network =
      txData.network?.version === TransactionVersion.Mainnet
        ? new StacksMainnet()
        : new StacksTestnet();
    txData.network = network;
  }
  switch (txData.txType) {
    case TransactionTypes.ContractCall:
      tx = await generateContractCallTx({ txData, senderKey, nonce });
      break;
    case TransactionTypes.ContractDeploy:
      tx = await generateContractDeployTx({ txData, senderKey, nonce });
      break;
    case TransactionTypes.STXTransfer:
      tx = await generateSTXTransferTx({ txData, senderKey, nonce });
      break;
    default:
      break;
  }
  if (!tx) {
    throw new Error(`Invalid Transaction Type: ${txData.txType}`);
  }
  return tx;
};

export const finishTransaction = async ({
  tx,
  pendingTransaction,
  nodeUrl,
}: {
  tx: StacksTransaction;
  pendingTransaction: TransactionPayloadWithAttachment;
  nodeUrl: string;
}): Promise<TxResult> => {
  const serialized = tx.serialize();
  const txRaw = `0x${serialized.toString('hex')}`;

  // if sponsored, return raw tx
  if (tx.auth.authType === AuthType.Sponsored) {
    return {
      txRaw,
    };
  }

  const response = await broadcastRawTransaction(
    serialized,
    `${nodeUrl}/v2/transactions`,
    pendingTransaction.attachment ? Buffer.from(pendingTransaction.attachment, 'hex') : undefined
  );

  if (typeof response === 'string') {
    return {
      txId: response,
      txRaw,
    };
  } else {
    const error = `${response.error} - ${response.reason}`;
    console.error(response.error);
    console.error(response.reason);
    throw new Error(error);
  }
};

function getTransactionVersionFromRequest(tx: TransactionPayload) {
  const { network } = tx;
  if (!network) return TransactionVersion.Mainnet;
  if (![TransactionVersion.Mainnet, TransactionVersion.Testnet].includes(network.version)) {
    throw new Error('Invalid network version provided');
  }
  return network.version;
}

export const UNAUTHORIZED_TX_REQUEST =
  'The transaction request provided is not signed by this wallet.';

/**
 * Verify a transaction request.
 * A transaction request is a signed JWT that is created on an app,
 * via `@stacks/connect`. The private key used to sign this JWT is an
 * `appPrivateKey`, which an app can get from authentication.
 *
 * The payload in this JWT can include an `stxAddress`. This indicates the
 * 'default' STX address that should be used to sign this transaction. This allows
 * the wallet to use the same account to sign a transaction as it used to sign
 * in to the app.
 *
 * This JWT is invalidated if:
 * - The JWT is not signed properly
 * - The public key used to sign this tx request does not match an `appPrivateKey`
 * for any of the accounts in this wallet.
 * - The `stxAddress` provided in the payload does not match an STX address
 * for any of the accounts in this wallet.
 *
 * @returns The decoded and validated `TransactionPayload`
 * @throws if the transaction request is invalid
 */
export const verifyTxRequest = async ({
  requestToken,
  wallet,
  appDomain,
}: {
  requestToken: string;
  wallet: Wallet;
  appDomain: string;
}): Promise<TransactionPayload> => {
  const token = decodeToken(requestToken);
  const tx = token.payload as unknown as TransactionPayload;
  const { publicKey, stxAddress } = tx;
  const txVersion = getTransactionVersionFromRequest(tx);
  const verifier = new TokenVerifier('ES256k', publicKey);
  const isSigned = await verifier.verifyAsync(requestToken);
  if (!isSigned) {
    throw new Error('Transaction request is not signed');
  }
  const foundAccount = wallet.accounts.find(account => {
    const appPrivateKey = getAppPrivateKey({
      account,
      appDomain,
    });
    const appPublicKey = getPublicKeyFromPrivate(appPrivateKey);
    if (appPublicKey !== publicKey) return false;
    if (!stxAddress) return true;
    const accountStxAddress = getAddressFromPrivateKey(account.stxPrivateKey, txVersion);
    if (stxAddress !== accountStxAddress) return false;
    return true;
  });
  if (!foundAccount) {
    throw new Error(UNAUTHORIZED_TX_REQUEST);
  }
  return tx;
};
