import { atomFamily } from 'jotai/utils';
import { ContractPrincipal, FtMeta, MetaDataMethodNames } from '@common/asset-types';
import { atom } from 'jotai';
import { getLocalData, setLocalData } from '@store/common/utils';
import { fetchFungibleTokenMetaData, getMatchingFunction } from '@store/assets/utils';
import { contractInterfaceState } from '@store/contracts';
import deepEqual from 'fast-deep-equal';
import { debugLabelWithContractPrincipal } from '@common/atom-utils';
import { currentNetworkState } from '@store/networks';

enum FungibleTokensQueryKeys {
  SIP_10_COMPLIANT = 'SIP_10_COMPLIANT',
  META_DATA_METHODS = 'META_DATA_METHODS',
  ASSET_META_DATA = 'ASSET_META_DATA',
}

type ContractWithNetwork = Readonly<ContractPrincipal & { networkUrl: string }>;

const assetMetaDataMethodsResponseState = atomFamily<
  ContractWithNetwork,
  MetaDataMethodNames | null
>(({ contractName, contractAddress, networkUrl }) => {
  const anAtom = atom(get => {
    const keyParams = [
      networkUrl,
      contractAddress,
      contractName,
      FungibleTokensQueryKeys.META_DATA_METHODS,
    ];
    const contractInterface = get(contractInterfaceState({ contractName, contractAddress }));
    if (!contractInterface) return null;
    const decimalsFunction = contractInterface.functions.find(getMatchingFunction('decimals'));
    const symbolFunction = contractInterface.functions.find(getMatchingFunction('symbol'));
    const nameFunction = contractInterface.functions.find(getMatchingFunction('name'));

    if (decimalsFunction && symbolFunction && nameFunction) {
      const data = {
        decimals: decimalsFunction.name,
        symbol: symbolFunction.name,
        name: nameFunction.name,
      };
      return setLocalData<MetaDataMethodNames>(keyParams, data);
    }
    return null;
  });
  debugLabelWithContractPrincipal(anAtom, 'assetMetaDataMethodsResponseState', {
    contractName,
    contractAddress,
    networkUrl,
  });
  return anAtom;
}, deepEqual);

const assetMetaDataMethods = atomFamily<ContractWithNetwork, MetaDataMethodNames | null>(
  ({ contractName, contractAddress, networkUrl }) => {
    const anAtom = atom(get => {
      const network = get(currentNetworkState);
      const keyParams = [
        network.url,
        contractAddress,
        contractName,
        FungibleTokensQueryKeys.META_DATA_METHODS,
      ];
      const local = getLocalData<MetaDataMethodNames>(keyParams);
      return (
        local ||
        get(
          assetMetaDataMethodsResponseState({
            contractName,
            contractAddress,
            networkUrl: network.url,
          })
        )
      );
    });
    debugLabelWithContractPrincipal(anAtom, 'assetMetaDataMethods', {
      contractName,
      contractAddress,
      networkUrl,
    });
    return anAtom;
  },
  deepEqual
);

export const assetMetaDataState = atomFamily<ContractWithNetwork, FtMeta | null>(
  ({ contractAddress, contractName, networkUrl }) => {
    const anAtom = atom(async get => {
      const methods = get(assetMetaDataMethods({ contractName, contractAddress, networkUrl }));
      const network = get(currentNetworkState);
      if (!methods) return null;
      const keyParams = [
        network.url,
        contractAddress,
        contractName,
        FungibleTokensQueryKeys.ASSET_META_DATA,
      ];
      const localData = getLocalData<FtMeta>(keyParams);
      if (localData) return localData;
      const data = await fetchFungibleTokenMetaData({
        contractName,
        contractAddress,
        network: network.url,
        methods,
      });
      return setLocalData(keyParams, data);
    });
    debugLabelWithContractPrincipal(anAtom, 'assetMetaDataState', {
      contractName,
      contractAddress,
      networkUrl,
    });
    return anAtom;
  },
  deepEqual
);
