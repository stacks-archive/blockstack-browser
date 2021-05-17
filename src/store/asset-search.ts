import { atom, selector } from 'recoil';
import { assetsState, AssetWithMeta } from '@store/tokens';

export const selectedAssetIdState = atom<string | undefined>({
  key: 'asset-search.asset-id',
  default: undefined,
});
export const selectedAssetStore = selector<AssetWithMeta | undefined>({
  key: 'asset-search.asset',
  get: ({ get }) => {
    const id = get(selectedAssetIdState);
    const assets = get(assetsState);
    return assets?.find(asset => asset.name === id);
  },
});

export const searchInputStore = atom<string>({
  key: 'asset-search.input',
  default: '',
});
