import { atom, selector } from 'recoil';
import { localStorageEffect } from './index';
import RPCClient from '@stacks/rpc-client';

interface Networks {
  [key: string]: {
    url: string;
    name: string;
  };
}

export const defaultNetworks: Networks = {
  // mainnet: {
  //   url: 'https://core.blockstack.org',
  //   name: 'Mainnet',
  // },
  testnet: {
    url: 'https://stacks-node-api.blockstack.org',
    name: 'Testnet',
  },
  localnet: {
    url: 'http://localhost:3999',
    name: 'Localnet',
  },
};

export const currentNetworkKeyStore = atom({
  key: 'networks.current-key',
  default: 'testnet',
  effects_UNSTABLE: [localStorageEffect()],
});

export const networksStore = atom<Networks>({
  key: 'networks.networks',
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

export const rpcClientStore = selector({
  key: 'networks.rpc-client',
  get: ({ get }) => {
    const network = get(currentNetworkStore);
    return new RPCClient(network.url);
  },
});
