import { atomFamily, selector, waitForAll } from 'recoil';
import { localStorageEffect } from '@store/common/utils';
import { currentNetworkState } from '@store/networks';
import { accountDataState, currentAccountStxAddressState } from '@store/accounts/index';
import { apiRevalidation } from '@store/common/api-helpers';
import { accountInfoStore } from '@store/accounts/index';

export const latestNoncesState = atomFamily<
  { nonce: number; blockHeight: number },
  [string, string]
>({
  key: 'wallet.latest-nonces',
  default: () => ({
    nonce: 0,
    blockHeight: 0,
  }),
  effects_UNSTABLE: [localStorageEffect()],
});

export const latestNonceState = selector({
  key: 'wallet.latest-nonce',
  get: ({ get }) => {
    const network = get(currentNetworkState);
    const address = get(currentAccountStxAddressState);
    return get(latestNoncesState([network.url, address || '']));
  },
});

export const correctNonceState = selector({
  key: 'api.correct-nonce',
  get: ({ get }) => {
    get(apiRevalidation);

    const { account, lastConfirmedTx, accountData, address } = get(
      waitForAll({
        account: accountInfoStore,
        lastConfirmedTx: latestNonceState,
        accountData: accountDataState,
        address: currentAccountStxAddressState,
      })
    );

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

    if (!hasTransactions || !account || account.nonce === 0) return 0;

    // if the oldest pending tx is more than 1 above the account nonce, it's likely there was
    // a race condition such that the client didn't have the most up to date pending tx
    // if this is true, we should rely on the account nonce
    const hasNonceMismatch = oldestPendingTx
      ? oldestPendingTx.nonce > lastConfirmedTx.nonce + 1
      : false;

    // if they do have a miss match, let's use the account nonce
    if (hasNonceMismatch) return account.nonce;

    // otherwise, without micro-blocks, the account nonce will likely be out of date compared
    // and not be incremented based on pending transactions
    const pendingNonce = (latestPendingTx && latestPendingTx.nonce) || 0;
    const usePendingNonce = pendingNonce > lastConfirmedTx.nonce;

    // if they have a last confirmed transaction (but no pending)
    // and it's greater than account nonce, we should use that one
    // else we will use the account nonce
    const useLastTxNonce = hasTransactions && lastConfirmedTx.nonce + 1 > account.nonce;
    const lastConfirmedNonce = useLastTxNonce ? lastConfirmedTx.nonce + 1 : account.nonce;

    return usePendingNonce
      ? // if pending nonce is greater, use that
        pendingNonce + 1
      : // else we use the last confirmed nonce
        lastConfirmedNonce;
  },
});
