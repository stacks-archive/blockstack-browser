import { atom } from 'recoil';

export interface Asset {
  name: string;
  contractAddress: string;
  subtitle: string;
  type: 'stx' | 'nft' | 'ft';
  balance: string;
}

export const selectedAssetStore = atom<Asset | undefined>({
  key: 'asset-search.asset',
  default: undefined,
});

export const searchInputStore = atom<string>({
  key: 'asset-search.input',
  default: '',
});
