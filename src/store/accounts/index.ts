import { MempoolTransaction, Transaction } from '@blockstack/stacks-blockchain-api-types';
import { Account, getStxAddress } from '@stacks/wallet-sdk';
import { atomWithDefault, waitForAll } from 'jotai/utils';
import { atom } from 'jotai';
import BN from 'bn.js';

import type { AllAccountData } from '@common/api/accounts';
import { fetchAllAccountData } from '@common/api/accounts';

import { transactionRequestStxAddressState } from '@store/transactions/requests';
import { currentNetworkState } from '@store/networks';
import { walletState } from '@store/wallet';
import { transactionNetworkVersionState } from '@store/transactions';
import { atomFamilyWithQuery } from '@store/query';
import { accountsApiClientState } from '@store/common/api-clients';

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
export const accountsState = atomWithDefault<Account[] | undefined>(get => {
  const wallet = get(walletState);
  if (!wallet) return undefined;
  return wallet.accounts;
});

export type AccountWithAddress = Account & { address: string };
// map through the accounts and get the address for the current network mode (testnet|mainnet)
export const accountsWithAddressState = atom<AccountWithAddress[] | undefined>(get => {
  const accounts = get(accountsState);
  const transactionVersion = get(transactionNetworkVersionState);
  if (!accounts) return undefined;
  return accounts.map(account => {
    const address = getStxAddress({ account, transactionVersion });
    return {
      ...account,
      address,
    };
  });
});

//--------------------------------------
// Current account
//--------------------------------------

// The index of the current account
// persists through sessions (viewings)
export const currentAccountIndexState = atom<number>(0);

// This is only used when there is a pending transaction request and
// the user switches accounts during the signing process
export const hasSwitchedAccountsState = atom<boolean>(false);

// if there is a pending transaction that has a stxAccount param
// find the index from the accounts atom and return it
export const transactionAccountIndexState = atom<number | undefined>(get => {
  const { accounts, txAddress } = get(
    waitForAll({
      accounts: accountsWithAddressState,
      txAddress: transactionRequestStxAddressState,
    })
  );

  if (txAddress && accounts) {
    return accounts.findIndex(account => account.address === txAddress); // selected account
  }
  return undefined;
});

// This contains the state of the current account:
// could be the account associated with an in-process transaction request
// or the last selected / first account of the user
export const currentAccountState = atom<AccountWithAddress | undefined>(get => {
  const { accountIndex, txIndex, hasSwitched, accounts } = get(
    waitForAll({
      accountIndex: currentAccountIndexState,
      txIndex: transactionAccountIndexState,
      hasSwitched: hasSwitchedAccountsState,
      accounts: accountsWithAddressState,
    })
  );
  if (!accounts) return undefined;
  if (typeof txIndex === 'number' && !hasSwitched) return accounts[txIndex];
  return accounts[accountIndex];
});

// gets the address of the current account (in the current network mode)
export const currentAccountStxAddressState = atom<string | undefined>(
  get => get(currentAccountState)?.address
);
// gets the private key of the current account
export const currentAccountPrivateKeyState = atom<string | undefined>(
  get => get(currentAccountState)?.stxPrivateKey
);

const accountDataResponseState = atomFamilyWithQuery<[string, string], AllAccountData | undefined>(
  `ALL_ACCOUNT_DATA`,
  async (_get, [address, networkUrl]) => {
    try {
      return fetchAllAccountData(networkUrl)(address);
    } catch (error) {
      console.error(error);
      console.error(`Unable to fetch account data from ${networkUrl}`);
      return;
    }
  }
);
// external API data associated with the current account's address
export const accountDataState = atom(get => {
  const { network, address } = get(
    waitForAll({
      network: currentNetworkState,
      address: currentAccountStxAddressState,
    })
  );
  if (!address) return;
  return get(accountDataResponseState([address, network.url]));
});

// the raw account info from the `v2/accounts` endpoint, should be most up-to-date info (compared to the extended API)
export const accountInfoResponseState = atomFamilyWithQuery<string, { balance: BN; nonce: number }>(
  'ACCOUNT_INFO_STATE_ATOM',
  async (get, principal) => {
    const client = get(accountsApiClientState);
    const data = await client.getAccountInfo({
      principal,
      proof: 0,
    });
    return {
      balance: new BN(data.balance.slice(2), 16),
      nonce: data.nonce,
    };
  }
);
export const accountInfoState = atom(get => {
  const principal = get(currentAccountStxAddressState);
  if (!principal) return;
  return get(accountInfoResponseState(principal));
});
// the balances of the current account's address
export const accountBalancesState = atom<AllAccountData['balances'] | undefined>(
  get => get(accountDataState)?.balances
);

// combo of pending and confirmed transactions for the current address
export const accountTransactionsState = atom<(MempoolTransaction | Transaction)[]>(get => {
  const data = get(accountDataState);
  const transactions = data?.transactions?.results || [];
  const pending = data?.pendingTransactions || [];
  return [...pending, ...transactions];
});

accountsState.debugLabel = 'accountsState';
accountsWithAddressState.debugLabel = 'accountsWithAddressState';
currentAccountIndexState.debugLabel = 'currentAccountIndexState';
hasSwitchedAccountsState.debugLabel = 'hasSwitchedAccountsState';
transactionAccountIndexState.debugLabel = 'transactionAccountIndexState';
currentAccountState.debugLabel = 'currentAccountState';
currentAccountStxAddressState.debugLabel = 'currentAccountStxAddressState';
currentAccountPrivateKeyState.debugLabel = 'currentAccountPrivateKeyState';
accountBalancesState.debugLabel = 'accountBalancesState';
accountTransactionsState.debugLabel = 'accountTransactionsState';
