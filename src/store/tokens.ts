import { selector, selectorFamily, waitForAll } from 'recoil';
import { SmartContractsApi, Configuration } from '@stacks/blockchain-api-client';
import { currentNetworkStore, rpcClientStore } from '@store/networks';
import { accountBalancesStore } from '@store/api';
import { ChainID, cvToString, hexToCV } from '@stacks/transactions';

import { AddressBalanceResponse } from '@blockstack/stacks-blockchain-api-types';
import { getAssetStringParts, truncateMiddle } from '@stacks/ui-utils';
import { SIP_010 } from '@common/constants';
import { ContractInterface, ContractInterfaceFunction } from '@stacks/rpc-client';
import { isSip10Transfer, SIP010TransferResponse } from '@common/token-utils';
import { fetcher } from '@common/wrapped-fetch';

interface ContractPrincipal {
  contractName: string;
  contractAddress: string;
}

interface MetaDataMethodNames {
  decimals: string;
  symbol: string;
  name: string;
}

interface Asset {
  name: string;
  contractAddress: string;
  contractName: string;
  subtitle: string;
  type: 'stx' | 'nft' | 'ft';
  balance: string;
  canTransfer?: boolean;
  hasMemo?: boolean;
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

type MetaDataNames = 'decimals' | 'symbol' | 'name';

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

async function fetchFungibleTokenMetaData({
  methods,
  ...options
}: FungibleTokenOptions & {
  methods: {
    decimals: string;
    name: string;
    symbol: string;
  };
}) {
  try {
    const [name, symbol, decimals] = await Promise.all([
      fetchName({ ...options, functionName: methods.name }),
      fetchSymbol({ ...options, functionName: methods.symbol }),
      fetchDecimals({ ...options, functionName: methods.decimals }),
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

function makeKey(networkUrl: string, address: string, name: string, key: string): string {
  return `${networkUrl}__${address}__${name}__${key}`;
}

function getLocalData(options: { networkUrl: string; address: string; name: string; key: string }) {
  const { networkUrl, address, name, key } = options;
  const _key = makeKey(networkUrl, address, name, key);
  const value = localStorage.getItem(_key);
  if (!value) return null;
  return JSON.parse(value);
}

function setLocalData(options: {
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

async function getSip10Status(params: {
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
      const local = getLocalData({
        networkUrl: network.url,
        address: contractAddress,
        name: contractName,
        key: 'asset.sip-010-compliant',
      });
      if (local || typeof local === 'boolean') return local;
      try {
        const data = await getSip10Status({
          networkUrl: network.url,
          contractAddress,
          contractName,
          chain,
        });
        if (typeof data === 'boolean')
          setLocalData({
            networkUrl: network.url,
            address: contractAddress,
            name: contractName,
            data,
            key: 'asset.sip-010-compliant',
          });
        return data;
      } catch (e) {
        console.log(e);
        return null;
      }
    },
});

const assetContractInterface = selectorFamily<ContractInterface, Readonly<ContractPrincipal>>({
  key: 'asset.contract-interface',
  get:
    ({ contractName, contractAddress }) =>
    async ({ get }) => {
      const network = get(currentNetworkStore);
      const rpcClient = get(rpcClientStore);
      const local = getLocalData({
        networkUrl: network.url,
        address: contractAddress,
        name: contractName,
        key: 'asset.contract-interface',
      });

      if (local) return local;
      const data = await rpcClient.fetchContractInterface({
        contractName,
        contractAddress,
      });
      setLocalData({
        networkUrl: network.url,
        address: contractAddress,
        name: contractName,
        data,
        key: 'asset.contract-interface',
      });
      return data;
    },
});

const getMatchingFunction = (name: MetaDataNames) => (func: ContractInterfaceFunction) =>
  (func.name === `get-${name}` || func.name === name) && func.access === 'read_only';

const assetMetaDataMethods = selectorFamily<
  MetaDataMethodNames | null,
  Readonly<ContractPrincipal>
>({
  key: 'asset.meta-data-methods',
  get:
    ({ contractName, contractAddress }) =>
    async ({ get }) => {
      const network = get(currentNetworkStore);

      const local = getLocalData({
        networkUrl: network.url,
        address: contractAddress,
        name: contractName,
        key: 'asset.meta-data-methods',
      });

      if (local) return local;

      const contractInterface = get(assetContractInterface({ contractName, contractAddress }));
      const decimalsFunction = contractInterface.functions.find(getMatchingFunction('decimals'));
      const symbolFunction = contractInterface.functions.find(getMatchingFunction('symbol'));
      const nameFunction = contractInterface.functions.find(getMatchingFunction('name'));

      if (decimalsFunction && symbolFunction && nameFunction) {
        const data = {
          decimals: decimalsFunction.name,
          symbol: symbolFunction.name,
          name: nameFunction.name,
        };
        setLocalData({
          networkUrl: network.url,
          address: contractAddress,
          name: contractName,
          data,
          key: 'asset.meta-data-methods',
        });
        return data;
      }

      return null;
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
      const methods = get(assetMetaDataMethods({ contractName, contractAddress }));
      if (!methods) return null;

      const isImplemented = get(
        assetSip10ImplementationState({
          contractAddress,
          contractName,
        })
      );
      const network = get(currentNetworkStore);
      const localData = getLocalData({
        networkUrl: network.url,
        address: contractAddress,
        name: contractName,
        key: 'asset.meta-data',
      });
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
        methods,
      });
      if (data) {
        setLocalData({
          networkUrl: network.url,
          address: contractAddress,
          name: contractName,
          data,
          key: 'asset.meta-data',
        });
        return {
          ...data,
          ftTrait: isImplemented,
        };
      }

      return null;
    },
});

export const canTransferAssetState = selectorFamily<
  undefined | SIP010TransferResponse,
  Readonly<ContractPrincipal>
>({
  key: 'assets.can-transfer',
  get:
    ({ contractName, contractAddress }) =>
    async ({ get }) => {
      if (!contractAddress || !contractName) return;
      const contractInterface = get(assetContractInterface({ contractName, contractAddress }));
      return isSip10Transfer({ contractInterface });
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
    canTransfer: true,
    hasMemo: true,
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

const assetItemState = selectorFamily<AssetWithMeta, Readonly<Asset>>({
  key: 'assets.item',
  get:
    asset =>
    ({ get }) => {
      if (asset.type === 'ft') {
        const { transferData, meta } = get(
          waitForAll({
            transferData: canTransferAssetState({
              contractAddress: asset.contractAddress,
              contractName: asset.contractName,
            }),
            meta: assetMetaDataState({
              contractAddress: asset.contractAddress,
              contractName: asset.contractName,
            }),
          })
        );

        const canTransfer = !(!transferData || 'error' in transferData);
        const hasMemo = transferData && !('error' in transferData) && transferData.hasMemo;
        return { ...asset, meta, canTransfer, hasMemo } as AssetWithMeta;
      }
      return asset as AssetWithMeta;
    },
});

export const assetsState = selector<AssetWithMeta[] | undefined>({
  key: 'assets.base',
  get: async ({ get }) => {
    const balance = get(accountBalancesStore);
    if (!balance) return;
    const assets = transformAssets(balance);
    return get(waitForAll(assets.map(asset => assetItemState(asset))));
  },
});

export const transferableAssetsState = selector({
  key: 'assets.transferable',
  get: ({ get }) => get(assetsState)?.filter(asset => asset.canTransfer),
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
