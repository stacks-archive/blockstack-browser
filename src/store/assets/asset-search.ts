import { atom, selector } from 'recoil';

import { assetsState, AssetWithMeta } from '@store/tokens';
import { getFullyQualifiedAssetName } from '@common/hooks/use-selected-asset';

enum KEYS {
  ASSET_ID = 'asset-search/ASSET_ID',
  ASSET = 'asset-search/ASSET',
  INPUT = 'asset-search/INPUT',
}

export const selectedAssetIdState = atom<string | undefined>({
  key: KEYS.ASSET_ID,
  default: undefined,
});

export const selectedAssetStore = selector<AssetWithMeta | undefined>({
  key: KEYS.ASSET,
  get: ({ get }) => {
    const fqn = get(selectedAssetIdState);
    const assets = get(assetsState);
    return assets?.find(asset => getFullyQualifiedAssetName(asset) === fqn);
  },
});

export const searchInputStore = atom<string>({
  key: KEYS.INPUT,
  default: '',
});

const defaultSearchResultState = selector({
  key: 'asset-search.results',
  get: async ({ get }) => get(assetsState),
});
export const searchResultState = atom<AssetWithMeta[] | undefined>({
  key: 'asset-search.results',
  default: defaultSearchResultState,
});
