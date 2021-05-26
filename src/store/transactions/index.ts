import { atom, selector, waitForAll } from 'recoil';
import { ChainID, TransactionVersion } from '@stacks/transactions';

import { currentNetworkState, currentStacksNetworkState } from '@store/networks';
import { correctNonceState } from '@store/accounts/nonce';
import { currentAccountState, currentAccountStxAddressState } from '@store/accounts';
import { requestTokenPayloadState } from '@store/transactions/requests';

import { generateSignedTransaction } from '@common/transactions/transactions';
import { getPostCondition, handlePostConditions } from '@common/transactions/postcondition-utils';
import { TransactionPayload } from '@stacks/connect';

enum KEYS {
  POST_CONDITIONS = 'transactions/POST_CONDITIONS',
  PENDING_TRANSACTION = 'transactions/PENDING_TRANSACTION',
  SIGNED_TRANSACTION = 'transactions/SIGNED_TRANSACTION',
  TX_VERSION = 'transactions/TX_VERSION',
  ERROR_IS_UNAUTHORIZED = 'transactions/ERROR_IS_UNAUTHORIZED',
  ERROR_BROADCAST_FAILURE = 'transactions/ERROR_BROADCAST_FAILURE',
}

export const postConditionsState = selector({
  key: KEYS.POST_CONDITIONS,
  get: ({ get }) => {
    const { payload, address } = get(
      waitForAll({
        payload: requestTokenPayloadState,
        address: currentAccountStxAddressState,
      })
    );

    if (!payload || !address) return;

    if (payload.postConditions) {
      if (payload.stxAddress)
        return handlePostConditions(payload.postConditions, payload.stxAddress, address);

      return payload.postConditions.map(getPostCondition);
    }
    return [];
  },
});

export const pendingTransactionState = selector({
  key: KEYS.PENDING_TRANSACTION,
  get: ({ get }) => {
    const { payload, postConditions, network } = get(
      waitForAll({
        payload: requestTokenPayloadState,
        postConditions: postConditionsState,
        network: currentStacksNetworkState,
      })
    );
    if (!payload) return;
    return { ...payload, postConditions, network };
  },
});

export const signedTransactionState = selector({
  key: KEYS.SIGNED_TRANSACTION,
  get: async ({ get }) => {
    const { account, pendingTransaction, nonce } = get(
      waitForAll({
        account: currentAccountState,
        pendingTransaction: pendingTransactionState,
        nonce: correctNonceState,
      })
    );
    if (!account || !pendingTransaction) return;
    return generateSignedTransaction({
      senderKey: account.stxPrivateKey,
      nonce,
      txData: pendingTransaction,
    });
  },
});

export const transactionNetworkVersionState = selector({
  key: KEYS.TX_VERSION,
  get: ({ get }) =>
    get(currentNetworkState).chainId === ChainID.Mainnet
      ? TransactionVersion.Mainnet
      : TransactionVersion.Testnet,
});

export type TransactionPayloadWithAttachment = TransactionPayload & {
  attachment?: string;
};
export const isUnauthorizedTransactionState = atom<boolean>({
  key: KEYS.ERROR_IS_UNAUTHORIZED,
  default: false,
});
export const transactionBroadcastErrorState = atom<string | null>({
  key: KEYS.ERROR_BROADCAST_FAILURE,
  default: null,
});
