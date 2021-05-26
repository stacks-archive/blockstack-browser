import { selector, selectorFamily } from 'recoil';
import { currentNetworkState } from '@store/networks';
import { accountBalancesState } from '@store/accounts';
import {
  fetchFungibleTokenMetaData,
  fetchSip10Status,
  getLocalData,
  getNetworkChain,
  setLocalData,
  transformAssets,
} from '@store/assets/utils';
import { AssetWithMeta, FtMeta } from '@store/assets/types';

enum KEYS {
  IS_SIP_010_COMPLIANT = 'assets/IS_SIP_010_COMPLIANT',
  META_DATA = 'assets/META_DATA',
  ASSETS = 'assets/ASSETS',
  FUNGIBLE_TOKENS = 'assets/FUNGIBLE_TOKENS',
  NON_FUNGIBLE_TOKENS = 'assets/NON_FUNGIBLE_TOKENS',
  STX_TOKEN = 'assets/STX_TOKEN',
}

// SIP 010 implementation state
//
// This atom will fetch the state of a given token and return
// true/false if it conforms to the standard.
// if it returns null, the implementation state is unknown.
export const assetSip10ImplementationState = selectorFamily<
  boolean | null,
  { contractName: string; contractAddress: string }
>({
  key: KEYS.IS_SIP_010_COMPLIANT,
  get:
    ({ contractName, contractAddress }) =>
    async ({ get }) => {
      const network = get(currentNetworkState);
      const chain = getNetworkChain(network);
      try {
        return fetchSip10Status({
          networkUrl: network.url,
          contractAddress,
          contractName,
          chain,
        });
      } catch (e) {
        console.error(e);
        return null;
      }
    },
});

export const assetMetaDataState = selectorFamily<
  FtMeta | null,
  { contractName: string; contractAddress: string }
>({
  key: KEYS.META_DATA,
  get:
    ({ contractName, contractAddress }) =>
    async ({ get }) => {
      const isImplemented = get(
        assetSip10ImplementationState({
          contractAddress,
          contractName,
        })
      );
      if (isImplemented || isImplemented === null) {
        const network = get(currentNetworkState);
        const localData = getLocalData(network.url, contractAddress, contractName);
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
        });
        if (data) {
          setLocalData(network.url, contractAddress, contractName, data);
          return {
            ...data,
            ftTrait: isImplemented,
          };
        }
      }
      return null;
    },
});

export const assetsState = selector<AssetWithMeta[] | undefined>({
  key: KEYS.ASSETS,
  get: async ({ get }) => {
    const balance = get(accountBalancesState);
    if (!balance) return;
    const assets = transformAssets(balance);
    const _assets: AssetWithMeta[] = (await Promise.all(
      assets.map(async asset => {
        if (asset.type === 'ft') {
          const meta = get(
            assetMetaDataState({
              contractAddress: asset.contractAddress,
              contractName: asset.contractName,
            })
          );
          if (meta)
            return {
              ...asset,
              meta,
            } as unknown as AssetWithMeta;
          return asset;
        }
        return asset;
      })
    )) as AssetWithMeta[];
    return _assets;
  },
});

export const fungibleTokensState = selector({
  key: KEYS.FUNGIBLE_TOKENS,
  get: ({ get }) => {
    const assets = get(assetsState);
    return assets?.filter(asset => asset.type === 'ft');
  },
});

export const nonFungibleTokensState = selector({
  key: KEYS.NON_FUNGIBLE_TOKENS,
  get: ({ get }) => {
    const assets = get(assetsState);
    return assets?.filter(asset => asset.type !== 'nft');
  },
});

export const stxTokenState = selector({
  key: KEYS.STX_TOKEN,
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
