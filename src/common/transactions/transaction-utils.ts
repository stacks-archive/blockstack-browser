import {
  AnchorMode,
  deserializeCV,
  makeContractCall,
  makeContractDeploy,
  makeSTXTokenTransfer,
} from '@stacks/transactions';
import { ContractCallPayload, ContractDeployPayload, STXTransferPayload } from '@stacks/connect';
import BN from 'bn.js';
import { getPostConditions } from '@common/transactions/postcondition-utils';

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
    anchorMode: AnchorMode.Any,
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
