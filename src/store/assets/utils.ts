import { cvToString, hexToCV } from '@stacks/transactions';
import { Configuration, SmartContractsApi } from '@stacks/blockchain-api-client';
import { ContractInterfaceFunction } from '@stacks/rpc-client';
import { SIP_010 } from '@common/constants';
import { fetcher } from '@common/api/wrapped-fetch';
import type { AddressBalanceResponse } from '@stacks/stacks-blockchain-api-types';
import { getAssetStringParts, truncateMiddle } from '@stacks/ui-utils';
import { Asset, FtMeta, FungibleTokenOptions, MetaDataNames } from '@common/asset-types';
import BigNumber from 'bignumber.js';

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

async function readOnlyFetcher(name: MetaDataNames, options: FungibleTokenOptions) {
  let hex = null;
  try {
    hex = await callReadOnlyFunction({ ...options, functionName: `get-${name}` });
  } catch (e) {
    hex = await callReadOnlyFunction({ ...options, functionName: name });
  }
  return hex;
}

async function fetchDecimals(options: FungibleTokenOptions & { functionName: string }) {
  const hex = await callReadOnlyFunction(options);
  const clarityValue = cvToString(hexToCV(hex));
  return parseInt(clarityValue.replace('(ok u', '').replace(')', ''));
}

async function fetchSymbol(options: FungibleTokenOptions & { functionName: string }) {
  const hex = await readOnlyFetcher('symbol', options);
  if (!hex) return;
  const clarityValue = cvToString(hexToCV(hex));
  return clarityValue.replace('(ok "', '').replace('")', '');
}

async function fetchName(options: FungibleTokenOptions & { functionName: string }) {
  const hex = await readOnlyFetcher('name', options);
  if (!hex) return;
  const clarityValue = cvToString(hexToCV(hex));
  return clarityValue.replace('(ok "', '').replace('")', '');
}

export async function fetchFungibleTokenMetaData({
  methods,
  ...options
}: FungibleTokenOptions & {
  methods: {
    decimals: string;
    name: string;
    symbol: string;
  };
}): Promise<FtMeta | null> {
  const [name, symbol, decimals] = await Promise.all([
    fetchName({ ...options, functionName: methods.name }),
    fetchSymbol({ ...options, functionName: methods.symbol }),
    fetchDecimals({ ...options, functionName: methods.decimals }),
  ]);
  return {
    name,
    symbol,
    decimals,
  } as FtMeta;
}

function makeKey(networkUrl: string, address: string, name: string, key: string): string {
  return `${networkUrl}__${address}__${name}__${key}`;
}

export function getLocalData(options: {
  networkUrl: string;
  address: string;
  name: string;
  key: string;
}) {
  const { networkUrl, address, name, key } = options;
  const _key = makeKey(networkUrl, address, name, key);
  const value = localStorage.getItem(_key);
  if (!value) return null;
  return JSON.parse(value);
}

export function setLocalData(options: {
  networkUrl: string;
  address: string;
  name: string;
  key: string;
  data: any;
}): void {
  const { networkUrl, address, name, data, key } = options;
  const _key = makeKey(networkUrl, address, name, key);
  return localStorage.setItem(_key, JSON.stringify(data));
}

export async function getSip10Status(params: {
  networkUrl: string;
  chain: 'mainnet' | 'testnet' | 'regtest';
  contractAddress: string;
  contractName: string;
}): Promise<boolean | null> {
  try {
    const { networkUrl, contractName, contractAddress, chain } = params;
    const { address, name, trait } = SIP_010[chain];
    const res = await fetcher(
      `${networkUrl}/v2/traits/${contractAddress}/${contractName}/${address}/${name}/${trait}`
    );
    const data: { is_implemented: boolean } = await res.json();

    return data.is_implemented;
  } catch (e) {
    return null;
  }
}

export const getMatchingFunction = (name: MetaDataNames) => (func: ContractInterfaceFunction) =>
  (func.name === `get-${name}` || func.name === name) && func.access === 'read_only';

export function transformAssets(balances?: AddressBalanceResponse) {
  const _assets: Asset[] = [];
  if (!balances) return _assets;
  _assets.push({
    type: 'stx',
    contractAddress: '',
    contractName: '',
    balance: new BigNumber(balances.stx.balance),
    subtitle: 'STX',
    name: 'Stacks Token',
    canTransfer: true,
    hasMemo: true,
  });
  Object.keys(balances.fungible_tokens).forEach(key => {
    const balance = new BigNumber(balances.fungible_tokens[key].balance);
    const { address, contractName, assetName } = getAssetStringParts(key);
    if (balance.isEqualTo(0)) return; // tokens users have traded will persist in the api response even if they don't have a balance
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
