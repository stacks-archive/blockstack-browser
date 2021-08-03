import { atomFamilyWithQuery } from '@store/query';
import { ContractPrincipal } from '@common/asset-types';
import { apiClientState } from '@store/common/api-clients';
import { atomFamily } from 'jotai/utils';
import { atom } from 'jotai';
import { currentNetworkState } from '@store/networks';
import { getLocalData, setLocalData } from '@store/common/utils';
import { ContractInterface } from '@stacks/rpc-client';
import deepEqual from 'fast-deep-equal';
import { ContractSourceResponse } from '@stacks/blockchain-api-client';

enum ContractQueryKeys {
  ContractInterface = 'queries/ContractInterface',
  ContractSource = 'queries/ContractSource',
}

export const contractInterfaceResponseState = atomFamilyWithQuery<
  ContractPrincipal,
  ContractInterface | null
>(ContractQueryKeys.ContractInterface, async (get, { contractAddress, contractName }) => {
  const { smartContractsApi } = get(apiClientState);
  const network = get(currentNetworkState);
  try {
    const data = (await smartContractsApi.getContractInterface({
      contractAddress,
      contractName,
    })) as ContractInterface;
    const keyParams = [
      network.url,
      contractAddress,
      contractName,
      ContractQueryKeys.ContractInterface,
    ];
    // for a given contract interface, it does not change once deployed so we should cache it
    return setLocalData(keyParams, data);
  } catch (e) {
    console.debug('contractInterfaceResponseState error', e);
    return null;
  }
});

export const contractInterfaceState = atomFamily<ContractPrincipal, ContractInterface | null>(
  ({ contractAddress, contractName }) => {
    const anAtom = atom(get => {
      const network = get(currentNetworkState);
      const keyParams = [
        network.url,
        contractAddress,
        contractName,
        ContractQueryKeys.ContractInterface,
      ];
      const localData = getLocalData<ContractInterface>(keyParams);
      if (localData) return localData;
      return get(contractInterfaceResponseState({ contractAddress, contractName }));
    });
    anAtom.debugLabel = `contractInterfaceState/${contractAddress}.${contractName}`;
    return anAtom;
  },
  deepEqual
);

export const contractSourceResponseState = atomFamilyWithQuery<
  ContractPrincipal,
  ContractSourceResponse
>(ContractQueryKeys.ContractSource, async (get, { contractAddress, contractName }) => {
  const { smartContractsApi } = get(apiClientState);
  const network = get(currentNetworkState);
  const data = await smartContractsApi.getContractSource({
    contractAddress,
    contractName,
  });
  const keyParams = [network.url, contractAddress, contractName, ContractQueryKeys.ContractSource];
  // for a given contract source, it does not change once deployed so we should cache it
  return setLocalData(keyParams, data);
});

export const contractSourceState = atomFamily<ContractPrincipal, ContractSourceResponse>(
  ({ contractAddress, contractName }) => {
    const anAtom = atom(get => {
      const network = get(currentNetworkState);
      const keyParams = [
        network.url,
        contractAddress,
        contractName,
        ContractQueryKeys.ContractSource,
      ];
      const localData = getLocalData<ContractSourceResponse>(keyParams);
      if (localData) return localData;
      return get(contractSourceResponseState({ contractAddress, contractName }));
    });
    anAtom.debugLabel = `contractSourceState/${contractAddress}.${contractName}`;
    return anAtom;
  },
  deepEqual
);
