import { atom, selector } from 'recoil';
import { localStorageEffect } from './index';
import RPCClient from '@stacks/rpc-client';
import { ChainID, TransactionVersion } from '@stacks/transactions';
import { StacksNetwork, StacksTestnet, StacksMainnet } from '@stacks/network';

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
    const transactionVersion =
      network.chainId === ChainID.Mainnet ? TransactionVersion.Mainnet : TransactionVersion.Testnet;
    return transactionVersion;
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
