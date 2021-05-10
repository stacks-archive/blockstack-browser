import { selector, atom, atomFamily, waitForAll } from 'recoil';
import { latestNonceStore, currentAccountStxAddressStore } from './wallet';
import { currentNetworkStore } from './networks';
import type {
  CoreNodeInfoResponse,
  BlockListResponse,
} from '@blockstack/stacks-blockchain-api-types';
import { fetchAllAccountData } from '@common/api/accounts';
import BN from 'bn.js';
import { fetchFromSidecar } from '@common/api/fetch';
import { fetcher } from '@common/wrapped-fetch';

const DEFAULT_POLL_RATE = 10000;

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
    const response = await fetcher(url, {
      credentials: 'omit',
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
      const res = await fetcher(infoUrl);
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

    const { account, lastTx, accountData, address } = get(
      waitForAll({
        account: accountInfoStore,
        lastTx: latestNonceStore,
        accountData: accountDataStore,
        address: currentAccountStxAddressStore,
      })
    );

    // pending transactions sent by current address
    const latestPendingTx = accountData?.pendingTransactions?.filter(
      tx => tx.sender_address === address
    )?.[0];
    // see if they have any pending or confirmed transactions
    const hasTransactions = !!latestPendingTx || lastTx.blockHeight > 0;

    const latestNonce = hasTransactions
      ? // if they do, use the greater of the two
        latestPendingTx && latestPendingTx.nonce > lastTx.nonce
        ? latestPendingTx.nonce + 1
        : lastTx.nonce + 1
      : // if they don't, default to 0
        0;

    return latestNonce > account.nonce ? latestNonce : account.nonce;
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
      console.error('Cannot get account info when logged out.');
      return;
    }
    try {
      return fetchAllAccountData(url)(address);
    } catch (error) {
      console.error(error);
      console.error(`Unable to fetch account data from ${url}`);
      return;
    }
  },
});

export const accountBalancesStore = selector({
  key: 'api.account-balances',
  get: ({ get }) => {
    const accountData = get(accountDataStore);
    return accountData?.balances;
  },
});
