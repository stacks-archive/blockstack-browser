import { atomFamily } from 'jotai/utils';
import { ContractPrincipal, FtMeta, MetaDataMethodNames } from '@store/assets/types';
import { atom } from 'jotai';
import { currentNetworkState } from '@store/networks';
import { getLocalData, setLocalData } from '@store/common/utils';
import { fetchFungibleTokenMetaData, getMatchingFunction } from '@store/assets/utils';
import { contractInterfaceState } from '@store/contracts';
import deepEqual from 'fast-deep-equal';
import { debugLabelWithContractPrincipal } from '@common/atom-utils';

enum FungibleTokensQueryKeys {
  SIP_10_COMPLIANT = 'SIP_10_COMPLIANT',
  META_DATA_METHODS = 'META_DATA_METHODS',
  ASSET_META_DATA = 'ASSET_META_DATA',
}

const assetMetaDataMethodsResponseState = atomFamily<
  Readonly<ContractPrincipal>,
  MetaDataMethodNames | null
>(({ contractName, contractAddress }) => {
  const anAtom = atom(get => {
    const network = get(currentNetworkState);
    const keyParams = [
      network.url,
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
  anAtom.debugLabel = `assetMetaDataMethodsResponseState/${contractAddress}.${contractName}`;
  return anAtom;
}, deepEqual);

const assetMetaDataMethods = atomFamily<Readonly<ContractPrincipal>, MetaDataMethodNames | null>(
  ({ contractName, contractAddress }) => {
    const anAtom = atom(get => {
      const network = get(currentNetworkState);
      const keyParams = [
        network.url,
        contractAddress,
        contractName,
        FungibleTokensQueryKeys.META_DATA_METHODS,
      ];
      const local = getLocalData<MetaDataMethodNames>(keyParams);
      return local || get(assetMetaDataMethodsResponseState({ contractName, contractAddress }));
    });
    debugLabelWithContractPrincipal(anAtom, 'assetMetaDataMethods', {
      contractName,
      contractAddress,
    });
    return anAtom;
  },
  deepEqual
);

export const assetMetaDataState = atomFamily<ContractPrincipal, FtMeta | null>(
  ({ contractAddress, contractName }) => {
    const anAtom = atom(async get => {
      const methods = get(assetMetaDataMethods({ contractName, contractAddress }));
      if (!methods) return null;
      const network = get(currentNetworkState);
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
    });
    return anAtom;
  },
  deepEqual
);
