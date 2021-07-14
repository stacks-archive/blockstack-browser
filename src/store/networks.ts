import { atomWithStorage } from 'jotai/utils';
import { atom } from 'jotai';
import { ChainID } from '@stacks/transactions';
import { StacksMainnet, StacksNetwork, StacksTestnet } from '@stacks/network';
import { transactionRequestNetwork } from '@store/transactions/requests';
import { fetchWithTimeout, findMatchingNetworkKey } from '@common/utils';
import { defaultNetworks, Networks, QueryRefreshRates } from '@common/constants';
import { blocksApiClientState, infoApiClientState } from '@store/common/api-clients';
import { atomFamilyWithQuery } from '@store/query';

// Our root networks list, users can add to this list and it will persist to localstorage
export const networksState = atomWithStorage<Networks>('networks', defaultNetworks);

// the current key selected
// if there is a pending transaction request, it will default to the network passed (if included)
// else it will default to the persisted key or default (mainnet)

const localCurrentNetworkKeyState = atomWithStorage('networkKey', 'mainnet');
export const currentNetworkKeyState = atom<string, string>(
  get => {
    const networks = get(networksState);
    const txNetwork = get(transactionRequestNetwork);

    // if txNetwork, default to this always, users cannot currently change networks when signing a transaction
    // @see https://github.com/blockstack/stacks-wallet-web/issues/1281
    if (txNetwork) {
      const newKey = findMatchingNetworkKey(txNetwork, networks);
      if (newKey) return newKey;
    }
    // otherwise default to the locally saved network key state
    return get(localCurrentNetworkKeyState);
  },
  (_get, set, update) => {
    if (update) set(localCurrentNetworkKeyState, update);
  }
);

// the `Network` object for the current key selected
export const currentNetworkState = atom(get => get(networksState)[get(currentNetworkKeyState)]);

// a `StacksNetwork` instance using the current network
export const currentStacksNetworkState = atom<StacksNetwork>(get => {
  const network = get(currentNetworkState);
  const stacksNetwork =
    network.chainId === ChainID.Testnet ? new StacksTestnet() : new StacksMainnet();
  stacksNetwork.coreApiUrl = network.url;
  stacksNetwork.bnsLookupUrl = network.url;
  return stacksNetwork;
});

// external data, the most recent block height of the selected network
export const latestBlockHeightState = atom(async get => {
  const client = get(blocksApiClientState);
  return (await client.getBlockList({}))?.results?.[0]?.height;
});

// external data, `v2/info` endpoint of the selected network
export const networkInfoState = atom(get => get(infoApiClientState).getCoreApiInfo());

export const networkOnlineStatusState = atomFamilyWithQuery<string, boolean>(
  'NETWORK_ONLINE',
  async (_get, networkUrl) => {
    try {
      const res = await fetchWithTimeout(networkUrl, { timeout: 4500 });
      return res?.status === 200;
    } catch (e) {
      return false;
    }
  },
  { refetchInterval: QueryRefreshRates.VERY_SLOW }
);

networksState.debugLabel = 'networksState';
localCurrentNetworkKeyState.debugLabel = 'localCurrentNetworkKeyState';
currentNetworkKeyState.debugLabel = 'currentNetworkKeyState';
currentNetworkState.debugLabel = 'currentNetworkState';
currentStacksNetworkState.debugLabel = 'currentStacksNetworkState';
latestBlockHeightState.debugLabel = 'latestBlockHeightState';
networkInfoState.debugLabel = 'networkInfoState';
