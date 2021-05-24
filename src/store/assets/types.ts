export interface Asset {
  name: string;
  contractAddress: string;
  contractName: string;
  subtitle: string;
  type: 'stx' | 'nft' | 'ft';
  balance: string;
}

export interface FungibleTokenOptions {
  contractName: string;
  contractAddress: string;
  network: string;
}

export interface FtMeta {
  name: string;
  symbol: string;
  decimals: number;
  ftTrait?: boolean | null;
}

export type AssetWithMeta = Asset & { meta?: FtMeta };
