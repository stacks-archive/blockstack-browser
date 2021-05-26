import { atomFamily, selector, waitForAll } from 'recoil';

import { accountDataState, currentAccountStxAddressState, accountInfoState } from '@store/accounts';
import { currentNetworkState } from '@store/networks';
import { apiRevalidation } from '@store/common/api-helpers';
import { localStorageEffect } from '@store/common/utils';

enum KEYS {
  LOCAL_NONCES = 'account/LOCAL_NONCES',
  LATEST_LOCAL_NONCE = 'account/LATEST_LOCAL_NONCE',
  CORRECT_NONCE = 'account/CORRECT_NONCE',
}

export const localNoncesState = atomFamily<
  { nonce: number; blockHeight: number },
  [string, string]
>({
  key: KEYS.LOCAL_NONCES,
  default: () => ({
    nonce: 0,
    blockHeight: 0,
  }),
  effects_UNSTABLE: [localStorageEffect()],
});

export const latestNonceState = selector({
  key: KEYS.LATEST_LOCAL_NONCE,
  get: ({ get }) => {
    const { network, address } = get(
      waitForAll({
        network: currentNetworkState,
        address: currentAccountStxAddressState,
      })
    );
    return get(localNoncesState([network.url, address || '']));
  },
});

export const correctNonceState = selector({
  key: KEYS.CORRECT_NONCE,
  get: ({ get }) => {
    get(apiRevalidation);

    const { account, accountData, address, latestLocalNonce } = get(
      waitForAll({
        account: accountInfoState,
        accountData: accountDataState,
        address: currentAccountStxAddressState,
        latestLocalNonce: latestNonceState,
      })
    );

    const lastLocalNonce = latestLocalNonce.nonce;

    // most recent confirmed transactions sent by current address
    const lastConfirmedTx = accountData?.transactions.results?.filter(
      tx => tx.sender_address === address
    )?.[0];

    // most recent pending transactions sent by current address
    const latestPendingTx = accountData?.pendingTransactions?.filter(
      tx => tx.sender_address === address
    )?.[0];

    // oldest pending transactions sent by current address
    const oldestPendingTx = accountData?.pendingTransactions?.length
      ? accountData?.pendingTransactions?.filter(tx => tx.sender_address === address)?.[
          accountData?.pendingTransactions?.length - 1
        ]
      : undefined;

    // they have any pending or confirmed transactions
    const hasTransactions = !!latestPendingTx || !!lastConfirmedTx;

    if (!hasTransactions || !account || (!hasTransactions && account.nonce === 0)) return 0;

    // if the oldest pending tx is more than 1 above the account nonce, it's likely there was
    // a race condition such that the client didn't have the most up to date pending tx
    // if this is true, we should rely on the account nonce
    const hasNonceMismatch =
      oldestPendingTx && lastConfirmedTx
        ? oldestPendingTx.nonce > lastConfirmedTx.nonce + 1
        : false;

    // if they do have a miss match, let's use the account nonce
    if (hasNonceMismatch) return account.nonce;

    // otherwise, without micro-blocks, the account nonce will likely be out of date compared
    // and not be incremented based on pending transactions
    const pendingNonce = latestPendingTx?.nonce || 0;
    const lastConfirmedTxNonce = lastConfirmedTx?.nonce || 0;

    // lastLocalNonce can be set when the user sends transactions
    // and can often be faster that waiting for a new response from the API
    const useLocalNonce = lastLocalNonce > pendingNonce && lastLocalNonce > lastConfirmedTxNonce;

    const usePendingNonce =
      !useLocalNonce &&
      ((lastConfirmedTx && pendingNonce > lastConfirmedTx.nonce) ||
        pendingNonce + 1 > account.nonce);

    // if they have a last confirmed transaction (but no pending)
    // and it's greater than account nonce, we should use that one
    // else we will use the account nonce
    const useLastTxNonce =
      hasTransactions && lastConfirmedTx && lastConfirmedTx.nonce + 1 > account.nonce;
    const lastConfirmedNonce =
      useLastTxNonce && lastConfirmedTx ? lastConfirmedTx.nonce + 1 : account.nonce;

    return useLocalNonce
      ? lastLocalNonce
      : usePendingNonce
      ? // if pending nonce is greater, use that
        pendingNonce + 1
      : // else we use the last confirmed nonce
        lastConfirmedNonce;
  },
});
