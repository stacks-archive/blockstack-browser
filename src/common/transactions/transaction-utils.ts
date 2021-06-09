import {
  AnchorMode,
  deserializeCV,
  makeContractCall,
  makeContractDeploy,
  makeSTXTokenTransfer,
  StacksTransaction,
} from '@stacks/transactions';
import { ContractCallPayload, ContractDeployPayload, STXTransferPayload } from '@stacks/connect';
import BN from 'bn.js';
import { getPostConditions } from '@common/transactions/postcondition-utils';
import { ChainID } from '@stacks/common';
import { StacksMainnet, StacksTestnet } from '@stacks/network';

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

  let network = txData.network;

  if (typeof txData.network?.getTransferFeeEstimateApiUrl !== 'function') {
    const Builder = txData.network?.chainId === ChainID.Testnet ? StacksTestnet : StacksMainnet;
    network = new Builder();
    if (txData.network?.coreApiUrl) network.coreApiUrl = txData.network?.coreApiUrl;
    if (txData.network?.bnsLookupUrl) network.bnsLookupUrl = txData.network?.bnsLookupUrl;
  }

  return makeContractCall({
    contractName,
    contractAddress,
    functionName,
    senderKey,
    anchorMode: AnchorMode.Any,
    functionArgs: args,
    nonce: nonce !== undefined ? new BN(nonce, 10) : undefined,
    postConditionMode: txData.postConditionMode,
    postConditions: getPostConditions(txData.postConditions),
    network,
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
    anchorMode: AnchorMode.Any,
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
    anchorMode: AnchorMode.Any,
    amount: new BN(amount),
    nonce: nonce !== undefined ? new BN(nonce, 10) : undefined,
    network: txData.network,
  });
};

export const stacksTransactionToHex = (transaction: StacksTransaction) =>
  `0x${transaction.serialize().toString('hex')}`;
