import { atom, DefaultValue, selector, waitForAll } from 'recoil';
import { localStorageEffect } from './common/utils';
import { ChainID } from '@stacks/transactions';
import { StacksMainnet, StacksNetwork, StacksTestnet } from '@stacks/network';
import { apiRevalidation } from '@store/common/api-helpers';
import { transactionRequestNetwork } from '@store/transactions/requests';
import { findMatchingNetworkKey } from '@common/utils';
import { defaultNetworks, Networks } from '@common/constants';
import { blocksApiClientState, infoApiClientState } from '@store/common/api-clients';

enum KEYS {
  NETWORKS = 'network/NETWORKS',
  CURRENT_KEY = 'network/CURRENT_KEY',
  CURRENT_KEY_DEFAULT = 'network/CURRENT_KEY_DEFAULT',
  CURRENT_NETWORK = 'network/CURRENT_NETWORK',
  STACKS_NETWORK = 'network/STACKS_NETWORK',
  LATEST_BLOCK_HEIGHT = 'network/LATEST_BLOCK_HEIGHT',
  INFO = 'network/INFO',
}

// Our root networks list, users can add to this list and it will persist to localstorage
export const networksState = atom<Networks>({
  key: KEYS.NETWORKS,
  default: defaultNetworks,
  effects_UNSTABLE: [localStorageEffect()],
});

// the current key selected
// if there is a pending transaction request, it will default to the network passed (if included)
// else it will default to the persisted key or default (mainnet)
export const currentNetworkKeyState = atom({
  key: KEYS.CURRENT_KEY,
  default: selector({
    key: KEYS.CURRENT_KEY_DEFAULT,
    get: ({ get }) => {
      const { networks, txNetwork } = get(
        waitForAll({
          networks: networksState,
          txNetwork: transactionRequestNetwork,
        })
      );
      if (txNetwork) {
        const newKey = findMatchingNetworkKey(txNetwork, networks);
        if (newKey) return newKey;
      }
      const savedValue = localStorage.getItem(KEYS.CURRENT_KEY);
      if (savedValue) {
        try {
          return JSON.parse(savedValue);
        } catch (e) {}
      }
      return 'mainnet';
    },
  }),
  effects_UNSTABLE: [
    ({ onSet }) => {
      onSet(newValue => {
        if (newValue instanceof DefaultValue) {
          localStorage.removeItem(KEYS.CURRENT_KEY);
        } else {
          localStorage.setItem(KEYS.CURRENT_KEY, JSON.stringify(newValue));
        }
      });
    },
  ],
});

// the `Network` object for the current key selected
export const currentNetworkState = selector({
  key: KEYS.CURRENT_NETWORK,
  get: ({ get }) => {
    const { networks, key } = get(
      waitForAll({
        networks: networksState,
        key: currentNetworkKeyState,
      })
    );
    return networks[key];
  },
});

// a `StacksNetwork` instance using the current network
export const currentStacksNetworkState = selector<StacksNetwork>({
  key: KEYS.STACKS_NETWORK,
  get: ({ get }) => {
    const network = get(currentNetworkState);
    const stacksNetwork =
      network.chainId === ChainID.Testnet ? new StacksTestnet() : new StacksMainnet();
    stacksNetwork.coreApiUrl = network.url;
    return stacksNetwork;
  },
});

// external data, the most recent block height of the selected network
export const latestBlockHeightState = selector({
  key: KEYS.LATEST_BLOCK_HEIGHT,
  get: async ({ get }) => {
    const client = get(blocksApiClientState);
    return (await client.getBlockList({}))?.results?.[0]?.height;
  },
});

// external data, `v2/info` endpoint of the selected network
export const networkInfoState = selector({
  key: KEYS.INFO,
  get: async ({ get }) => {
    get(apiRevalidation);
    return get(infoApiClientState).getCoreApiInfo();
  },
});
