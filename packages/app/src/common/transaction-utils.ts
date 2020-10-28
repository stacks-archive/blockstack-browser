import {
  TransactionVersion,
  StacksTransaction,
  deserializeCV,
} from '@blockstack/stacks-transactions';
import { PostCondition } from '@blockstack/stacks-transactions/lib/postcondition';
import { Wallet } from '@stacks/keychain';
import { getRPCClient } from './stacks-utils';
import {
  ContractDeployPayload,
  ContractCallPayload,
  STXTransferPayload,
  TransactionPayload,
  TransactionTypes,
} from '@stacks/connect';
import { doTrack, TRANSACTION_SIGN_SUBMIT, TRANSACTION_SIGN_ERROR } from '@common/track';
import { finalizeTxSignature } from './utils';
import BigNum from 'bn.js';

const getPostConditions = (postConditions?: PostCondition[]): PostCondition[] | undefined => {
  return postConditions?.map(postCondition => {
    if ('amount' in postCondition && postCondition.amount) {
      return {
        ...postCondition,
        amount: new BigNum(postCondition.amount, 16),
      };
    }
    return postCondition;
  });
};

export const generateContractCallTx = ({
  txData,
  wallet,
  nonce,
}: {
  txData: ContractCallPayload;
  wallet: Wallet;
  nonce: number;
}) => {
  const { contractName, contractAddress, functionName, functionArgs } = txData;
  const version = TransactionVersion.Testnet;
  const args = functionArgs.map(arg => {
    return deserializeCV(Buffer.from(arg, 'hex'));
  });

  return wallet.getSigner().signContractCall({
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
  wallet,
  nonce,
}: {
  txData: ContractDeployPayload;
  wallet: Wallet;
  nonce: number;
}) => {
  const { contractName, codeBody } = txData;
  const version = TransactionVersion.Testnet;

  return wallet.getSigner().signContractDeploy({
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
  wallet,
  nonce,
}: {
  txData: STXTransferPayload;
  wallet: Wallet;
  nonce: number;
}) => {
  const { recipient, memo, amount } = txData;
  return wallet.getSigner().signSTXTransfer({
    recipient,
    memo,
    amount,
    nonce,
    network: txData.network,
  });
};

export const generateTransaction = async ({
  txData,
  wallet,
  nonce,
}: {
  wallet: Wallet;
  nonce: number;
  txData: TransactionPayload;
}) => {
  let tx: StacksTransaction | null = null;
  switch (txData.txType) {
    case TransactionTypes.ContractCall:
      tx = await generateContractCallTx({ txData, wallet, nonce });
      break;
    case TransactionTypes.ContractDeploy:
      tx = await generateContractDeployTx({ txData, wallet, nonce });
      break;
    case TransactionTypes.STXTransfer:
      tx = await generateSTXTransferTx({ txData, wallet, nonce });
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
}: {
  tx: StacksTransaction;
  pendingTransaction: TransactionPayload;
}) => {
  const serialized = tx.serialize();
  const txRaw = serialized.toString('hex');
  const client = getRPCClient();
  const res = await client.broadcastTX(serialized);

  if (res.ok) {
    doTrack(TRANSACTION_SIGN_SUBMIT, {
      txType: pendingTransaction?.txType,
      appName: pendingTransaction?.appDetails?.name,
    });
    const txId: string = await res.json();
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
