import { MempoolTransaction, Transaction } from '@blockstack/stacks-blockchain-api-types';
import { Account, getStxAddress } from '@stacks/wallet-sdk';
import { atom, selector, waitForAll } from 'recoil';
import BN from 'bn.js';

import type { AllAccountData } from '@common/api/accounts';
import { fetchAllAccountData } from '@common/api/accounts';
import { apiRevalidation, intervalStore } from '@store/common/api-helpers';
import { fetcher } from '@common/wrapped-fetch';

import { transactionRequestStxAddressState } from '@store/transactions/requests';
import { currentNetworkState, networkTransactionVersionState } from '@store/networks';
import { DEFAULT_POLLING_INTERVAL } from '@store/common/constants';
import { walletState } from '@store/wallet';

/**
 * --------------------------------------
 * Overview
 * --------------------------------------
 *
 * accountsState -- the array of accounts from the wallet state, uses `walletState`
 * accountsWithAddressState - a mapped array of the above state with the current network mode stx address included
 * currentAccountIndexStore - the last selected index by the user (or default 0)
 * hasSwitchedAccountsState - a toggle for when a user switches accounts during a pending transaction request
 * transactionAccountIndexState - if `stxAccount` is passed with a transaction request, this is the index of that address
 * currentAccountState - the current active account, either the account associated with a pending transaction request, or the one selected by the user
 * currentAccountStxAddressState - a selector for the address of the current account
 * accountDataState -- all external API data for the selected STX address
 * accountBalancesState - a selector for the balances from `accountDataState`
 * accountInfoStore - external API data from the `v2/accounts` endpoint, should be the most up-to-date
 */

//--------------------------------------
// All accounts
//--------------------------------------
export const accountsState = selector<Account[] | undefined>({
  key: 'accounts.base',
  get: ({ get }) => {
    const wallet = get(walletState);
    if (!wallet) return undefined;
    return wallet.accounts;
  },
});

export type AccountWithAddress = Account & { address: string };
// map through the accounts and get the address for the current network mode (testnet|mainnet)
export const accountsWithAddressState = selector<AccountWithAddress[] | undefined>({
  key: 'accounts.with-address',
  get: ({ get }) => {
    const accounts = get(accountsState);
    const transactionVersion = get(networkTransactionVersionState);
    if (!accounts) return undefined;
    return accounts.map(account => {
      const address = getStxAddress({ account, transactionVersion });
      return {
        ...account,
        address,
      };
    });
  },
});

//--------------------------------------
// Current account
//--------------------------------------

// The index of the current account
// persists through sessions (viewings)
export const currentAccountIndexStore = atom<number | undefined>({
  key: 'wallet.current-account-index',
  default: undefined,
});

// This is only used when there is a pending transaction request and
// the user switches accounts during the signing process
export const hasSwitchedAccountsState = atom<boolean>({
  key: 'account.has-switched',
  default: false,
});

// if there is a pending transaction that has a stxAccount param
// find the index from the accounts atom and return it
export const transactionAccountIndexState = selector<number | undefined>({
  key: 'account.transaction-account-index',
  get: ({ get }) => {
    const { accounts, txAddress } = get(
      waitForAll({
        accounts: accountsWithAddressState,
        txAddress: transactionRequestStxAddressState,
      })
    );
    if (txAddress && accounts) {
      const selectedAccount = accounts.findIndex(account => account.address === txAddress);
      if (selectedAccount) return selectedAccount;
    }
    return undefined;
  },
});

// This contains the state of the current account:
// could be the account associated with an in-process transaction request
// or the last selected / first account of the user
export const currentAccountState = selector<AccountWithAddress | undefined>({
  key: 'account.current',
  get: ({ get }) => {
    const { accountIndex, txIndex, hasSwitched, accounts } = get(
      waitForAll({
        accountIndex: currentAccountIndexStore,
        txIndex: transactionAccountIndexState,
        hasSwitched: hasSwitchedAccountsState,
        accounts: accountsWithAddressState,
      })
    );
    if (!accounts) return undefined;
    if (typeof txIndex === 'number' && !hasSwitched) return accounts[txIndex];
    if (typeof accountIndex === 'number') return accounts[accountIndex];
    return undefined;
  },
  dangerouslyAllowMutability: true,
});

// gets the address of the current account (in the current network mode)
export const currentAccountStxAddressState = selector<string | undefined>({
  key: 'account.current-address',
  get: ({ get }) => get(currentAccountState)?.address,
});

// external API data associated with the current account's address
export const accountDataState = selector<AllAccountData | undefined>({
  key: 'account.data',
  get: async ({ get }) => {
    const { network, address } = get(
      waitForAll({
        apiRevalidation,
        interval: intervalStore(DEFAULT_POLLING_INTERVAL),
        network: currentNetworkState,
        address: currentAccountStxAddressState,
      })
    );
    if (!address) return;
    try {
      return fetchAllAccountData(network.url)(address);
    } catch (error) {
      console.error(error);
      console.error(`Unable to fetch account data from ${network.url}`);
      return;
    }
  },
});

// the balances of the current account's address
export const accountBalancesState = selector<AllAccountData['balances'] | undefined>({
  key: 'account.balances',
  get: ({ get }) => get(accountDataState)?.balances,
});

// the raw account info from the `v2/accounts` endpoint, should be most up-to-date info (compared to the extended API)
export const accountInfoStore = selector<undefined | { balance: BN; nonce: number }>({
  key: 'account.info',
  get: async ({ get }) => {
    const { address, network } = get(
      waitForAll({
        revalidation: apiRevalidation,
        interval: intervalStore(DEFAULT_POLLING_INTERVAL),
        address: currentAccountStxAddressState,
        network: currentNetworkState,
      })
    );
    if (!address) return;
    const url = `${network.url}/v2/accounts/${address}`;
    const error = new Error(`Unable to fetch account info from ${url}`);
    const response = await fetcher(url);
    if (!response.ok) throw error;
    const data = await response.json();
    return {
      balance: new BN(data.balance.slice(2), 16),
      nonce: data.nonce,
    };
  },
});

// combo of pending and confirmed transactions for the current address
export const accountTransactionsState = selector<(MempoolTransaction | Transaction)[]>({
  key: 'account.all-transactions',
  get: async ({ get }) => {
    const data = get(accountDataState);
    const transactions = data?.transactions?.results || [];
    const pending = data?.pendingTransactions || [];
    return [...pending, ...transactions];
  },
});
