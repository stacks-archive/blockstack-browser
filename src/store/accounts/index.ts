import { atom, selector } from 'recoil';
import { currentNetworkStore, currentTransactionVersion } from '@store/networks';
import { Account, getStxAddress } from '@stacks/wallet-sdk';
import { walletState } from '@store/wallet';
import { apiRevalidation, intervalStore } from '@store/common/api';
import { fetchAllAccountData } from '@common/api/accounts';
import BN from 'bn.js';
import { fetcher } from '@common/wrapped-fetch';
import { DEFAULT_POLLING_INTERVAL } from '@store/common/constants';

export const currentAccountIndexStore = atom<number | undefined>({
  key: 'wallet.current-account-index',
  default: undefined,
});

export const currentAccountStore = selector({
  key: 'wallet.current-account',
  get: ({ get }) => {
    const accountIndex = get(currentAccountIndexStore);
    const wallet = get(walletState);
    if (accountIndex === undefined || !wallet) {
      return undefined;
    }
    return wallet.accounts[accountIndex];
  },
});

export const currentAccountStxAddressStore = selector({
  key: 'wallet.current-stx-address',
  get: ({ get }) => {
    const account = get(currentAccountStore);
    if (!account) return undefined;
    const transactionVersion = get(currentTransactionVersion);
    return getStxAddress({ account, transactionVersion });
  },
});

export const accountsState = selector<Account[] | undefined>({
  key: 'wallet.accounts',
  get: ({ get }) => {
    const wallet = get(walletState);
    if (!wallet) return undefined;
    return wallet.accounts;
  },
});

export const accountBalancesStore = selector({
  key: 'api.account-balances',
  get: ({ get }) => {
    const accountData = get(accountDataStore);
    return accountData?.balances;
  },
});

export const accountDataStore = selector({
  key: 'api.account-data',
  get: async ({ get }) => {
    get(apiRevalidation);
    get(intervalStore(DEFAULT_POLLING_INTERVAL));
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

export const accountInfoStore = selector<{ balance: BN; nonce: number }>({
  key: 'wallet.account-info',
  get: async ({ get }) => {
    get(apiRevalidation);
    get(intervalStore(DEFAULT_POLLING_INTERVAL));
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

export const accountTransactionsState = selector({
  key: 'activity.transactions',
  get: async ({ get }) => {
    const data = get(accountDataStore);
    const transactions = data?.transactions?.results || [];
    const pending = data?.pendingTransactions || [];
    return [...pending, ...transactions];
  },
});
