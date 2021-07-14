import { atom } from 'jotai';
import { requestTokenPayloadState } from '@store/transactions/requests';
import { TransactionTypes } from '@stacks/connect';
import { ContractInterfaceResponse } from '@stacks/blockchain-api-client';
import { ContractInterfaceFunction } from '@stacks/rpc-client';
import { contractInterfaceState, contractSourceState } from '@store/contracts';
import { waitForAll } from 'jotai/utils';

type ContractInterfaceResponseWithFunctions = Omit<ContractInterfaceResponse, 'functions'> & {
  functions: ContractInterfaceFunction[];
};

export const transactionContractInterfaceState = atom<
  undefined | ContractInterfaceResponseWithFunctions
>(async get => {
  const payload = get(requestTokenPayloadState);
  if (payload?.txType !== TransactionTypes.ContractCall) return;
  try {
    const data = get(
      contractInterfaceState({
        contractName: payload.contractName,
        contractAddress: payload.contractAddress,
      })
    );
    if (!data) return undefined;
    return data as ContractInterfaceResponseWithFunctions;
  } catch (e) {
    return undefined;
  }
});

export const transactionContractSourceState = atom(get => {
  const payload = get(requestTokenPayloadState);
  if (payload?.txType !== TransactionTypes.ContractCall) return;
  try {
    return get(
      contractSourceState({
        contractName: payload.contractName,
        contractAddress: payload.contractAddress,
      })
    );
  } catch (e) {
    return undefined;
  }
});

export const transactionFunctionsState = atom(get => {
  const { payload, contractInterface } = get(
    waitForAll({
      payload: requestTokenPayloadState,
      contractInterface: transactionContractInterfaceState,
    })
  );

  if (!payload || payload.txType !== 'contract_call' || !contractInterface) return undefined;

  const selectedFunction = contractInterface.functions.find(func => {
    return func.name === payload.functionName;
  });
  if (!selectedFunction) {
    throw new Error(
      `Attempting to call a function (\`${payload.functionName}\`) that ` +
        `does not exist on contract ${payload.contractAddress}.${payload.contractName}`
    );
  }
  return selectedFunction;
});

transactionContractInterfaceState.debugLabel = 'transactionContractInterfaceState';
transactionContractSourceState.debugLabel = 'transactionContractSourceState';
transactionFunctionsState.debugLabel = 'transactionFunctionsState';
