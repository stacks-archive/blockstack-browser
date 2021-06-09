import { selector, selectorFamily, waitForAll } from 'recoil';
import { currentNetworkState } from '@store/networks';
import { accountBalancesState } from '@store/accounts';
import { ChainID } from '@stacks/transactions';
import { ContractInterface } from '@stacks/rpc-client';
import { isSip10Transfer, SIP010TransferResponse } from '@common/token-utils';
import { smartContractClientState } from '@store/common/api-clients';
import {
  fetchFungibleTokenMetaData,
  getLocalData,
  getMatchingFunction,
  getSip10Status,
  setLocalData,
  transformAssets,
} from '@store/assets/utils';
import {
  Asset,
  AssetWithMeta,
  ContractPrincipal,
  FtMeta,
  MetaDataMethodNames,
} from '@store/assets/types';

export const assetSip10ImplementationState = selectorFamily<
  boolean | null,
  { contractName: string; contractAddress: string }
>({
  key: 'asset.sip-010-compliant',
  get:
    ({ contractName, contractAddress }) =>
    async ({ get }) => {
      const network = get(currentNetworkState);
      const chain = network.url.includes('regtest')
        ? 'regtest'
        : network.chainId === ChainID.Testnet
        ? 'testnet'
        : 'mainnet';
      const local = getLocalData({
        networkUrl: network.url,
        address: contractAddress,
        name: contractName,
        key: 'asset.sip-010-compliant',
      });
      if (local || typeof local === 'boolean') return local;
      try {
        const data = await getSip10Status({
          networkUrl: network.url,
          contractAddress,
          contractName,
          chain,
        });
        if (typeof data === 'boolean')
          setLocalData({
            networkUrl: network.url,
            address: contractAddress,
            name: contractName,
            data,
            key: 'asset.sip-010-compliant',
          });
        return data;
      } catch (e) {
        console.log(e);
        return null;
      }
    },
});

const assetContractInterface = selectorFamily<ContractInterface, Readonly<ContractPrincipal>>({
  key: 'asset.contract-interface',
  get:
    ({ contractName, contractAddress }) =>
    async ({ get }) => {
      const network = get(currentNetworkState);
      const client = get(smartContractClientState);

      const local = getLocalData({
        networkUrl: network.url,
        address: contractAddress,
        name: contractName,
        key: 'asset.contract-interface',
      });

      if (local) return local;
      const data = await client.getContractInterface({
        contractName,
        contractAddress,
      });
      setLocalData({
        networkUrl: network.url,
        address: contractAddress,
        name: contractName,
        data,
        key: 'asset.contract-interface',
      });
      return data;
    },
});

const assetMetaDataMethods = selectorFamily<
  MetaDataMethodNames | null,
  Readonly<ContractPrincipal>
>({
  key: 'asset.meta-data-methods',
  get:
    ({ contractName, contractAddress }) =>
    async ({ get }) => {
      const network = get(currentNetworkState);

      const local = getLocalData({
        networkUrl: network.url,
        address: contractAddress,
        name: contractName,
        key: 'asset.meta-data-methods',
      });

      if (local) return local;

      const contractInterface = get(assetContractInterface({ contractName, contractAddress }));
      const decimalsFunction = contractInterface.functions.find(getMatchingFunction('decimals'));
      const symbolFunction = contractInterface.functions.find(getMatchingFunction('symbol'));
      const nameFunction = contractInterface.functions.find(getMatchingFunction('name'));

      if (decimalsFunction && symbolFunction && nameFunction) {
        const data = {
          decimals: decimalsFunction.name,
          symbol: symbolFunction.name,
          name: nameFunction.name,
        };
        setLocalData({
          networkUrl: network.url,
          address: contractAddress,
          name: contractName,
          data,
          key: 'asset.meta-data-methods',
        });
        return data;
      }

      return null;
    },
});

export const assetMetaDataState = selectorFamily<
  FtMeta | null,
  { contractName: string; contractAddress: string }
>({
  key: 'asset.meta-data',
  get:
    ({ contractName, contractAddress }) =>
    async ({ get }) => {
      const methods = get(assetMetaDataMethods({ contractName, contractAddress }));
      if (!methods) return null;

      const isImplemented = get(
        assetSip10ImplementationState({
          contractAddress,
          contractName,
        })
      );
      const network = get(currentNetworkState);
      const localData = getLocalData({
        networkUrl: network.url,
        address: contractAddress,
        name: contractName,
        key: 'asset.meta-data',
      });
      if (localData) {
        return {
          ...localData,
          ftTrait: isImplemented,
        };
      }
      const data = await fetchFungibleTokenMetaData({
        contractName,
        contractAddress,
        network: network.url,
        methods,
      });
      if (data) {
        setLocalData({
          networkUrl: network.url,
          address: contractAddress,
          name: contractName,
          data,
          key: 'asset.meta-data',
        });
        return {
          ...data,
          ftTrait: isImplemented,
        };
      }

      return null;
    },
});

export const canTransferAssetState = selectorFamily<
  undefined | SIP010TransferResponse,
  Readonly<ContractPrincipal>
>({
  key: 'assets.can-transfer',
  get:
    ({ contractName, contractAddress }) =>
    async ({ get }) => {
      if (!contractAddress || !contractName) return;
      const contractInterface = get(assetContractInterface({ contractName, contractAddress }));
      return isSip10Transfer({ contractInterface });
    },
});

const assetItemState = selectorFamily<AssetWithMeta, Readonly<Asset>>({
  key: 'assets.item',
  get:
    asset =>
    ({ get }) => {
      if (asset.type === 'ft') {
        const { transferData, meta } = get(
          waitForAll({
            transferData: canTransferAssetState({
              contractAddress: asset.contractAddress,
              contractName: asset.contractName,
            }),
            meta: assetMetaDataState({
              contractAddress: asset.contractAddress,
              contractName: asset.contractName,
            }),
          })
        );

        const canTransfer = !(!transferData || 'error' in transferData);
        const hasMemo = transferData && !('error' in transferData) && transferData.hasMemo;
        return { ...asset, meta, canTransfer, hasMemo } as AssetWithMeta;
      }
      return asset as AssetWithMeta;
    },
});

export const assetsState = selector<AssetWithMeta[] | undefined>({
  key: 'assets.base',
  get: async ({ get }) => {
    const balance = get(accountBalancesState);
    if (!balance) return;
    const assets = transformAssets(balance);
    return get(waitForAll(assets.map(asset => assetItemState(asset))));
  },
});

export const transferableAssetsState = selector({
  key: 'assets.transferable',
  get: ({ get }) => get(assetsState)?.filter(asset => asset.canTransfer),
});

export const fungibleTokensState = selector({
  key: 'assets.ft',
  get: ({ get }) => {
    const assets = get(assetsState);
    return assets?.filter(asset => asset.type === 'ft');
  },
});
export const nonFungibleTokensState = selector({
  key: 'assets.nft',
  get: ({ get }) => {
    const assets = get(assetsState);
    return assets?.filter(asset => asset.type !== 'nft');
  },
});
export const stxTokenState = selector({
  key: 'assets.stx',
  get: ({ get }) => {
    const balances = get(accountBalancesState);
    if (!balances || balances.stx.balance === '0') return;
    return {
      type: 'stx',
      contractAddress: '',
      balance: balances.stx.balance,
      subtitle: 'STX',
      name: 'Stacks Token',
    } as AssetWithMeta;
  },
});
