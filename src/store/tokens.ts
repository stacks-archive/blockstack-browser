import { selector, selectorFamily } from 'recoil';
import { SmartContractsApi, Configuration } from '@stacks/blockchain-api-client';
import { currentNetworkStore } from '@store/networks';
import { accountBalancesStore } from '@store/api';
import { ChainID, cvToString, hexToCV } from '@stacks/transactions';

import { AddressBalanceResponse } from '@blockstack/stacks-blockchain-api-types';
import { getAssetStringParts, truncateMiddle } from '@stacks/ui-utils';
import { SIP_010 } from '@common/constants';

interface Asset {
  name: string;
  contractAddress: string;
  contractName: string;
  subtitle: string;
  type: 'stx' | 'nft' | 'ft';
  balance: string;
}

interface FungibleTokenOptions {
  contractName: string;
  contractAddress: string;
  network: string;
}

interface FtMeta {
  name: string;
  symbol: string;
  decimals: number;
  ftTrait?: boolean | null;
}

export type AssetWithMeta = Asset & { meta?: FtMeta };

async function callReadOnlyFunction({
  contractName,
  contractAddress,
  functionName,
  network,
}: {
  functionName: string;
} & FungibleTokenOptions) {
  const config = new Configuration({ basePath: network });
  const client = new SmartContractsApi(config);
  const { result, okay } = await client.callReadOnlyFunction({
    contractName,
    contractAddress,
    functionName,
    readOnlyFunctionArgs: {
      sender: contractAddress,
      arguments: [],
    },
  });
  if (okay) return result as string;
  throw new Error('Asset data fetch failed');
}

async function fetchDecimals(options: FungibleTokenOptions) {
  const hex = await callReadOnlyFunction({ ...options, functionName: 'get-decimals' });
  const clarityValue = cvToString(hexToCV(hex));
  return parseInt(clarityValue.replace('(ok u', '').replace(')', ''));
}

async function fetchSymbol(options: FungibleTokenOptions) {
  const hex = await callReadOnlyFunction({ ...options, functionName: 'get-symbol' });
  const clarityValue = cvToString(hexToCV(hex));
  return clarityValue.replace('(ok "', '').replace('")', '');
}

async function fetchName(options: FungibleTokenOptions) {
  const hex = await callReadOnlyFunction({ ...options, functionName: 'get-name' });
  const clarityValue = cvToString(hexToCV(hex));
  return clarityValue.replace('(ok "', '').replace('")', '');
}

async function fetchFungibleTokenMetaData(options: FungibleTokenOptions) {
  try {
    const [name, symbol, decimals] = await Promise.all([
      fetchName(options),
      fetchSymbol(options),
      fetchDecimals(options),
    ]);
    return {
      name,
      symbol,
      decimals,
    };
  } catch (e) {
    return null;
  }
}

function makeKey(networkUrl: string, address: string, name: string): string {
  return `${networkUrl}__${address}__${name}`;
}

function getLocalData(networkUrl: string, address: string, name: string) {
  const key = makeKey(networkUrl, address, name);
  const value = localStorage.getItem(key);
  if (!value) return null;
  return JSON.parse(value);
}

function setLocalData(networkUrl: string, address: string, name: string, data: any): void {
  const key = makeKey(networkUrl, address, name);
  return localStorage.setItem(key, JSON.stringify(data));
}

async function getSip10Status(params: {
  networkUrl: string;
  chain: 'mainnet' | 'testnet' | 'regtest';
  contractAddress: string;
  contractName: string;
}): Promise<boolean | null> {
  try {
    const { networkUrl, contractName, contractAddress, chain } = params;
    const { address, name, trait } = SIP_010[chain];
    const res = await fetch(
      `${networkUrl}/v2/traits/${contractAddress}/${contractName}/${address}/${name}/${trait}`
    );
    const data: { is_implemented: boolean } = await res.json();

    return data.is_implemented;
  } catch (e) {
    return null;
  }
}

export const assetSip10ImplementationState = selectorFamily<
  boolean | null,
  { contractName: string; contractAddress: string }
>({
  key: 'asset.sip-010-compliant',
  get:
    ({ contractName, contractAddress }) =>
    async ({ get }) => {
      const network = get(currentNetworkStore);
      const chain = network.url.includes('regtest')
        ? 'regtest'
        : network.chainId === ChainID.Testnet
        ? 'testnet'
        : 'mainnet';
      try {
        return getSip10Status({
          networkUrl: network.url,
          contractAddress,
          contractName,
          chain,
        });
      } catch (e) {
        console.log(e);
        return null;
      }
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
      const isImplemented = get(
        assetSip10ImplementationState({
          contractAddress,
          contractName,
        })
      );
      if (isImplemented || isImplemented === null) {
        const network = get(currentNetworkStore);
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

function transformAssets(balances: AddressBalanceResponse) {
  const _assets: Asset[] = [];
  if (!balances) return _assets;
  _assets.push({
    type: 'stx',
    contractAddress: '',
    contractName: '',
    balance: balances.stx.balance,
    subtitle: 'STX',
    name: 'Stacks Token',
  });
  Object.keys(balances.fungible_tokens).forEach(key => {
    const { balance } = balances.fungible_tokens[key];
    const { address, contractName, assetName } = getAssetStringParts(key);
    _assets.push({
      type: 'ft',
      subtitle: `${truncateMiddle(address)}.${contractName}`,
      contractAddress: address,
      contractName,
      name: assetName,
      balance: balance,
    });
  });
  return _assets;
}

export const assetsState = selector<AssetWithMeta[] | undefined>({
  key: 'assets',
  get: async ({ get }) => {
    const balance = get(accountBalancesStore);
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
    const balances = get(accountBalancesStore);
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
