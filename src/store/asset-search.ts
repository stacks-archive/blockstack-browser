import { atom, selector } from 'recoil';
import { assetsState, AssetWithMeta } from '@store/tokens';
import { getFullyQualifiedAssetName } from '@common/hooks/use-selected-asset';

export const selectedAssetIdState = atom<string | undefined>({
  key: 'asset-search.asset-id',
  default: undefined,
});
export const selectedAssetStore = selector<AssetWithMeta | undefined>({
  key: 'asset-search.asset',
  get: ({ get }) => {
    const fqn = get(selectedAssetIdState);
    const assets = get(assetsState);
    return assets?.find(asset => getFullyQualifiedAssetName(asset) === fqn);
  },
});

export const searchInputStore = atom<string>({
  key: 'asset-search.input',
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
