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
