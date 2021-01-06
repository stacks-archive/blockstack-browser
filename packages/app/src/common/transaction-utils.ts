import {
  TransactionVersion,
  StacksTransaction,
  deserializeCV,
} from '@blockstack/stacks-transactions';
import { PostCondition } from '@blockstack/stacks-transactions/lib/postcondition';
import { WalletSigner } from '@stacks/keychain';
import {
  ContractDeployPayload,
  ContractCallPayload,
  STXTransferPayload,
  TransactionPayload,
  TransactionTypes,
} from '@stacks/connect';
import { doTrack, TRANSACTION_SIGN_SUBMIT, TRANSACTION_SIGN_ERROR } from '@common/track';
import { finalizeTxSignature } from './utils';
import RPCClient from '@stacks/rpc-client';
import BN from 'bn.js';

const getPostConditions = (postConditions?: PostCondition[]): PostCondition[] | undefined => {
  return postConditions?.map(postCondition => {
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
  signer,
  nonce,
}: {
  txData: ContractCallPayload;
  signer: WalletSigner;
  nonce?: number;
}) => {
  const { contractName, contractAddress, functionName, functionArgs } = txData;
  const version = TransactionVersion.Testnet;
  const args = functionArgs.map(arg => {
    return deserializeCV(Buffer.from(arg, 'hex'));
  });

  return signer.signContractCall({
    contractName,
    contractAddress,
    functionName,
    functionArgs: args,
    version,
    nonce,
    postConditionMode: txData.postConditionMode,
    postConditions: getPostConditions(txData.postConditions),
    network: txData.network,
  });
};

export const generateContractDeployTx = ({
  txData,
  signer,
  nonce,
}: {
  txData: ContractDeployPayload;
  signer: WalletSigner;
  nonce?: number;
}) => {
  const { contractName, codeBody } = txData;
  const version = TransactionVersion.Testnet;

  return signer.signContractDeploy({
    contractName,
    codeBody,
    version,
    nonce,
    postConditionMode: txData.postConditionMode,
    postConditions: getPostConditions(txData.postConditions),
    network: txData.network,
  });
};

export const generateSTXTransferTx = ({
  txData,
  signer,
  nonce,
}: {
  txData: STXTransferPayload;
  signer: WalletSigner;
  nonce?: number;
}) => {
  const { recipient, memo, amount } = txData;
  return signer.signSTXTransfer({
    recipient,
    memo,
    amount,
    nonce,
    network: txData.network,
  });
};

export const generateTransaction = async ({
  txData,
  signer,
  nonce,
}: {
  signer: WalletSigner;
  nonce?: number;
  txData: TransactionPayload;
}) => {
  let tx: StacksTransaction | null = null;
  switch (txData.txType) {
    case TransactionTypes.ContractCall:
      tx = await generateContractCallTx({ txData, signer, nonce });
      break;
    case TransactionTypes.ContractDeploy:
      tx = await generateContractDeployTx({ txData, signer, nonce });
      break;
    case TransactionTypes.STXTransfer:
      tx = await generateSTXTransferTx({ txData, signer, nonce });
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
  pendingTransaction: TransactionPayload;
  nodeUrl: string;
}) => {
  const serialized = tx.serialize();
  const rpcClient = new RPCClient(nodeUrl);
  const res = await rpcClient.broadcastTX(serialized);

  if (res.ok) {
    doTrack(TRANSACTION_SIGN_SUBMIT, {
      txType: pendingTransaction?.txType,
      appName: pendingTransaction?.appDetails?.name,
    });
    const txIdJson: string = await res.json();
    const txId = `0x${txIdJson}`;
    const txRaw = `0x${serialized.toString('hex')}`;
    finalizeTxSignature({ txId, txRaw });
  } else {
    const response = await res.json();
    if (response.error) {
      const error = `${response.error} - ${response.reason}`;
      doTrack(TRANSACTION_SIGN_ERROR, {
        txType: pendingTransaction?.txType,
        appName: pendingTransaction?.appDetails?.name,
        error: error,
      });
      console.error(response.error);
      console.error(response.reason);
      throw new Error(error);
    }
  }
};
