import { Configuration, SmartContractsApi } from '@stacks/blockchain-api-client';
import { ChainID, cvToString, hexToCV } from '@stacks/transactions';
import { SIP_010 } from '@common/constants';
import { Asset, FungibleTokenOptions } from '@store/assets/types';
import { Network } from '@store/networks';
import { AddressBalanceResponse } from '@blockstack/stacks-blockchain-api-types';
import { getAssetStringParts, truncateMiddle } from '@stacks/ui-utils';

export async function callReadOnlyFunction({
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

export async function fetchDecimals(options: FungibleTokenOptions) {
  const hex = await callReadOnlyFunction({ ...options, functionName: 'get-decimals' });
  const clarityValue = cvToString(hexToCV(hex));
  return parseInt(clarityValue.replace('(ok u', '').replace(')', ''));
}

export async function fetchSymbol(options: FungibleTokenOptions) {
  const hex = await callReadOnlyFunction({ ...options, functionName: 'get-symbol' });
  const clarityValue = cvToString(hexToCV(hex));
  return clarityValue.replace('(ok "', '').replace('")', '');
}

export async function fetchName(options: FungibleTokenOptions) {
  const hex = await callReadOnlyFunction({ ...options, functionName: 'get-name' });
  const clarityValue = cvToString(hexToCV(hex));
  return clarityValue.replace('(ok "', '').replace('")', '');
}

export async function fetchSip10Status(params: {
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

export async function fetchFungibleTokenMetaData(options: FungibleTokenOptions) {
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

export function makeKey(networkUrl: string, address: string, name: string): string {
  return `${networkUrl}__${address}__${name}`;
}

export function getLocalData(networkUrl: string, address: string, name: string) {
  const key = makeKey(networkUrl, address, name);
  const value = localStorage.getItem(key);
  if (!value) return null;
  return JSON.parse(value);
}

export function setLocalData(networkUrl: string, address: string, name: string, data: any): void {
  const key = makeKey(networkUrl, address, name);
  return localStorage.setItem(key, JSON.stringify(data));
}

export function getNetworkChain(network: Network) {
  return network.url.includes('regtest')
    ? 'regtest'
    : network.chainId === ChainID.Testnet
    ? 'testnet'
    : 'mainnet';
}

export function transformAssets(balances: AddressBalanceResponse) {
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
