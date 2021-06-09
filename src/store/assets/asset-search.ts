import { atom, selector } from 'recoil';

import { assetsState } from '@store/assets/tokens';
import { getFullyQualifiedAssetName } from '@common/hooks/use-selected-asset';
import { AssetWithMeta } from '@store/assets/types';

enum ASSET_SEARCH_KEYS {
  ASSET_ID = 'asset-search/ASSET_ID',
  ASSET = 'asset-search/ASSET',
  INPUT = 'asset-search/INPUT',
}

export const selectedAssetIdState = atom<string | undefined>({
  key: ASSET_SEARCH_KEYS.ASSET_ID,
  default: undefined,
});

export const selectedAssetStore = selector<AssetWithMeta | undefined>({
  key: ASSET_SEARCH_KEYS.ASSET,
  get: ({ get }) => {
    const fqn = get(selectedAssetIdState);
    const assets = get(assetsState);
    return assets?.find(asset => getFullyQualifiedAssetName(asset) === fqn);
  },
});

export const searchInputStore = atom<string>({
  key: ASSET_SEARCH_KEYS.INPUT,
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
