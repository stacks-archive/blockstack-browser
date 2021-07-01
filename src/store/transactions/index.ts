import { atom } from 'jotai';
import { waitForAll } from 'jotai/utils';

import { AuthType, ChainID, TransactionVersion } from '@stacks/transactions';

import { currentNetworkState, currentStacksNetworkState } from '@store/networks';
import { correctNonceState } from '@store/accounts/nonce';
import { currentAccountState } from '@store/accounts';
import { requestTokenPayloadState } from '@store/transactions/requests';

import { generateSignedTransaction } from '@common/transactions/transactions';
import { TransactionPayload } from '@stacks/connect';
import { stacksTransactionToHex } from '@common/transactions/transaction-utils';
import { postConditionsState } from '@store/transactions/post-conditions';

export const pendingTransactionState = atom(get => {
  const { payload, postConditions, network } = get(
    waitForAll({
      payload: requestTokenPayloadState,
      postConditions: postConditionsState,
      network: currentStacksNetworkState,
    })
  );
  if (!payload) return;
  return { ...payload, postConditions, network };
});

export const transactionAttachmentState = atom(get => get(pendingTransactionState)?.attachment);

export const signedStacksTransactionState = atom(get => {
  const { account, txData, nonce } = get(
    waitForAll({
      account: currentAccountState,
      txData: pendingTransactionState,
      nonce: correctNonceState,
    })
  );
  if (!account || !txData) return;
  return generateSignedTransaction({
    senderKey: account.stxPrivateKey,
    nonce,
    txData,
  });
});

export const signedTransactionState = atom(get => {
  const signedTransaction = get(signedStacksTransactionState);
  if (!signedTransaction) return;
  const serialized = signedTransaction.serialize();
  const txRaw = stacksTransactionToHex(signedTransaction);
  return {
    serialized,
    isSponsored: signedTransaction?.auth?.authType === AuthType.Sponsored,
    nonce: signedTransaction?.auth.spendingCondition?.nonce.toNumber(),
    fee: signedTransaction?.auth.spendingCondition?.fee?.toNumber(),
    txRaw,
  };
});

export const transactionFeeState = atom(get => {
  return get(signedTransactionState)?.fee;
});
export const transactionSponsoredState = atom(get => {
  return get(signedTransactionState)?.isSponsored;
});
export const transactionNetworkVersionState = atom(get =>
  get(currentNetworkState)?.chainId === ChainID.Mainnet
    ? TransactionVersion.Mainnet
    : TransactionVersion.Testnet
);

export type TransactionPayloadWithAttachment = TransactionPayload & {
  attachment?: string;
};
export const isUnauthorizedTransactionState = atom<boolean>(false);
export const transactionBroadcastErrorState = atom<string | null>(null);

// dev tooling
postConditionsState.debugLabel = 'postConditionsState';
pendingTransactionState.debugLabel = 'pendingTransactionState';
transactionAttachmentState.debugLabel = 'transactionAttachmentState';
signedStacksTransactionState.debugLabel = 'signedStacksTransactionState';
signedTransactionState.debugLabel = 'signedTransactionState';
transactionNetworkVersionState.debugLabel = 'transactionNetworkVersionState';
isUnauthorizedTransactionState.debugLabel = 'isUnauthorizedTransactionState';
transactionBroadcastErrorState.debugLabel = 'transactionBroadcastErrorState';
