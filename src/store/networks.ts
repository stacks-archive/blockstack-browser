import { atom, selector } from 'recoil';
import { localStorageEffect } from './common/utils';
import RPCClient from '@stacks/rpc-client';
import { ChainID, TransactionVersion } from '@stacks/transactions';
import { StacksNetwork, StacksTestnet, StacksMainnet } from '@stacks/network';
import { BlockListResponse, CoreNodeInfoResponse } from '@blockstack/stacks-blockchain-api-types';
import { fetchFromSidecar } from '@common/api/fetch';
import { fetcher } from '@common/wrapped-fetch';
import { apiRevalidation } from '@store/common/api';

export interface Network {
  url: string;
  name: string;
  chainId: ChainID;
}

interface Networks {
  [key: string]: Network;
}

export const defaultNetworks: Networks = {
  mainnet: {
    url: 'https://stacks-node-api.mainnet.stacks.co',
    name: 'Mainnet',
    chainId: ChainID.Mainnet,
  },
  testnet: {
    url: 'https://stacks-node-api.testnet.stacks.co',
    name: 'Testnet',
    chainId: ChainID.Testnet,
  },
  regtest: {
    url: 'https://stacks-node-api.regtest.stacks.co',
    name: 'Regtest',
    chainId: ChainID.Testnet,
  },
  localnet: {
    url: 'http://localhost:3999',
    name: 'Localnet',
    chainId: ChainID.Testnet,
  },
};

export const currentNetworkKeyStore = atom({
  key: 'networks.current-key-v2',
  default: 'mainnet',
  effects_UNSTABLE: [localStorageEffect()],
});

export const networksStore = atom<Networks>({
  key: 'networks.networks-v3',
  default: defaultNetworks,
  effects_UNSTABLE: [localStorageEffect()],
});

export const currentNetworkStore = selector({
  key: 'networks.current-network',
  get: ({ get }) => {
    const networks = get(networksStore);
    const key = get(currentNetworkKeyStore);
    return networks[key];
  },
});

export const currentTransactionVersion = selector({
  key: 'networks.transaction-version',
  get: ({ get }) => {
    const network = get(currentNetworkStore);
    return network.chainId === ChainID.Mainnet
      ? TransactionVersion.Mainnet
      : TransactionVersion.Testnet;
  },
});

export const rpcClientStore = selector({
  key: 'networks.rpc-client',
  get: ({ get }) => {
    const network = get(currentNetworkStore);
    return new RPCClient(network.url);
  },
});

export const stacksNetworkStore = selector<StacksNetwork>({
  key: 'networks.stacks-network',
  get: ({ get }) => {
    const network = get(currentNetworkStore);
    const stacksNetwork =
      network.chainId === ChainID.Testnet ? new StacksTestnet() : new StacksMainnet();
    stacksNetwork.coreApiUrl = network.url;
    return stacksNetwork;
  },
});

export const latestBlockHeightStore = selector({
  key: 'api.latest-block-height',
  get: async ({ get }) => {
    const { url } = get(currentNetworkStore);
    const blocksResponse: BlockListResponse = await fetchFromSidecar(url)('/block');
    const [block] = blocksResponse.results;
    return block.height;
  },
});

export const chainInfoStore = selector({
  key: 'api.chain-info',
  get: async ({ get }) => {
    get(apiRevalidation);
    const { url } = get(currentNetworkStore);
    const infoUrl = `${url}/v2/info`;
    try {
      const res = await fetcher(infoUrl);
      if (!res.ok) throw `Unable to fetch chain data from ${infoUrl}`;
      const info: CoreNodeInfoResponse = await res.json();
      return info;
    } catch (error) {
      throw `Unable to fetch chain data from ${infoUrl}`;
    }
  },
});
