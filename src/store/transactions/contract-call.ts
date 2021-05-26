import { selector, waitForAll } from 'recoil';
import { requestTokenPayloadState } from '@store/transactions/requests';
import { smartContractClientState } from '@store/common/api-clients';
import { TransactionTypes } from '@stacks/connect';
import { ContractInterfaceResponse } from '@stacks/blockchain-api-client';
import { ContractInterfaceFunction } from '@stacks/rpc-client';

enum KEYS {
  CONTRACT_INTERFACE = 'transactions/CONTRACT_INTERFACE',
  CONTRACT_SOURCE = 'transactions/CONTRACT_SOURCE',
  FUNCTION = 'transactions/FUNCTION',
}

type ContractInterfaceResponseWithFunctions = Omit<ContractInterfaceResponse, 'functions'> & {
  functions: ContractInterfaceFunction[];
};

export const transactionContractInterfaceState = selector<
  undefined | ContractInterfaceResponseWithFunctions
>({
  key: KEYS.CONTRACT_INTERFACE,
  get: async ({ get }) => {
    const { payload, client } = get(
      waitForAll({
        payload: requestTokenPayloadState,
        client: smartContractClientState,
      })
    );

    if (payload?.txType !== TransactionTypes.ContractCall) return;
    try {
      const data = await client.getContractInterface({
        contractName: payload.contractName,
        contractAddress: payload.contractAddress,
      });
      if (!data) return undefined;
      return data as ContractInterfaceResponseWithFunctions;
    } catch (e) {
      return undefined;
    }
  },
});

export const transactionContractSourceState = selector({
  key: KEYS.CONTRACT_SOURCE,
  get: async ({ get }) => {
    const { payload, client } = get(
      waitForAll({
        payload: requestTokenPayloadState,
        client: smartContractClientState,
      })
    );

    if (payload?.txType !== TransactionTypes.ContractCall) return;

    try {
      return client.getContractSource({
        contractName: payload.contractName,
        contractAddress: payload.contractAddress,
      });
    } catch (e) {
      return undefined;
    }
  },
});
export const transactionFunctionsState = selector({
  key: KEYS.FUNCTION,
  get: ({ get }) => {
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
  },
});
