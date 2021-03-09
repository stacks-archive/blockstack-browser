import { selector, atom, atomFamily } from 'recoil';
import { latestNonceStore, currentAccountStxAddressStore } from './wallet';
import { currentNetworkStore } from './networks';
import type {
  CoreNodeInfoResponse,
  BlockListResponse,
} from '@blockstack/stacks-blockchain-api-types';
import { fetchAllAccountData } from '@common/api/accounts';
import BN from 'bn.js';
import { defaultHeaders, fetchFromSidecar } from '@common/api/fetch';

const DEFAULT_POLL_RATE = 60000;

export const apiRevalidation = atom({
  key: 'api.revalidation',
  default: 0,
});

export const intervalStore = atomFamily<number, number>({
  key: 'api.intervals',
  default: 0,
  effects_UNSTABLE: (intervalMilliseconds: number) => [
    ({ setSelf }) => {
      const interval = setInterval(() => {
        setSelf(current => {
          if (typeof current === 'number') {
            return current + 1;
          }
          return 1;
        });
      }, intervalMilliseconds);

      return () => {
        clearInterval(interval);
      };
    },
  ],
});

export const accountInfoStore = selector<{ balance: BN; nonce: number }>({
  key: 'wallet.account-info',
  get: async ({ get }) => {
    get(apiRevalidation);
    const address = get(currentAccountStxAddressStore);
    if (!address) {
      throw new Error('Cannot get account info when logged out.');
    }
    const network = get(currentNetworkStore);
    const url = `${network.url}/v2/accounts/${address}`;
    const error = new Error(`Unable to fetch account info from ${url}`);
    const response = await fetch(url, {
      credentials: 'omit',
      headers: defaultHeaders,
    });
    if (!response.ok) throw error;
    const data = await response.json();
    return {
      balance: new BN(data.balance.slice(2), 16),
      nonce: data.nonce,
    };
  },
});

export const chainInfoStore = selector({
  key: 'api.chain-info',
  get: async ({ get }) => {
    get(apiRevalidation);
    const { url } = get(currentNetworkStore);
    const infoUrl = `${url}/v2/info`;
    try {
      const res = await fetch(infoUrl, { headers: defaultHeaders });
      if (!res.ok) throw `Unable to fetch chain data from ${infoUrl}`;
      const info: CoreNodeInfoResponse = await res.json();
      return info;
    } catch (error) {
      throw `Unable to fetch chain data from ${infoUrl}`;
    }
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

export const correctNonceStore = selector({
  key: 'api.correct-nonce',
  get: ({ get }) => {
    get(apiRevalidation);
    const blockHeight = get(latestBlockHeightStore);
    const account = get(accountInfoStore);
    const lastTx = get(latestNonceStore);

    // Blocks have been mined since the last TX from this user.
    // This is the most likely scenario.
    if (account.nonce > lastTx.nonce) {
      return account.nonce;
    }
    // The current stacks chain has been reset or advanced since the last tx
    if (blockHeight !== lastTx.blockHeight) {
      return account.nonce;
    }

    // No blocks have been mined since the latest transaction from this user.
    if (lastTx) return lastTx.nonce + 1;
    return account.nonce;
  },
});

export const accountDataStore = selector({
  key: 'api.account-data',
  get: async ({ get }) => {
    get(apiRevalidation);
    get(intervalStore(DEFAULT_POLL_RATE));
    const { url } = get(currentNetworkStore);
    const address = get(currentAccountStxAddressStore);
    if (!address) {
      throw new Error('Cannot get account info when logged out.');
    }
    try {
      const accountData = await fetchAllAccountData(url)(address);
      return accountData;
    } catch (error) {
      throw `Unable to fetch account data from ${url}`;
    }
  },
});

export const accountBalancesStore = selector({
  key: 'api.account-balances',
  get: ({ get }) => {
    const accountData = get(accountDataStore);
    return accountData.balances;
  },
});
