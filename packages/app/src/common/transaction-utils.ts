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
} from '@stacks/transactions';
import {
  ContractDeployPayload,
  ContractCallPayload,
  STXTransferPayload,
  TransactionPayload,
  TransactionTypes,
  FinishedTxPayload,
} from '@stacks/connect';
import { doTrack, TRANSACTION_SIGN_SUBMIT, TRANSACTION_SIGN_ERROR } from '@common/track';
import RPCClient from '@stacks/rpc-client';
import BN from 'bn.js';
import { StacksMainnet, StacksTestnet } from '@stacks/network';

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
  const { contractName, contractAddress, functionName, functionArgs } = txData;
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
  pendingTransaction: TransactionPayload;
  nodeUrl: string;
}): Promise<FinishedTxPayload> => {
  const serialized = tx.serialize();
  const rpcClient = new RPCClient(nodeUrl);
  const res = await rpcClient.broadcastTX(serialized);

  if (res.ok) {
    doTrack(TRANSACTION_SIGN_SUBMIT, {
      txType: pendingTransaction?.txType,
      appName: pendingTransaction?.appDetails?.name,
    });
    const txIdJson: string = await res.json();
    const txId = `0x${txIdJson.replace('"', '')}`;
    const txRaw = `0x${serialized.toString('hex')}`;
    return {
      txId,
      txRaw,
    };
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
    throw new Error('Unable to submit transaction');
  }
};
