import { useWallet } from './use-wallet';
import { transactionBroadcastErrorState, isUnauthorizedTransactionState } from '@store/transaction';
import { useRecoilCallback, useRecoilValue, waitForAll } from 'recoil';
import { currentNetworkState } from '@store/networks';
import { finishTransaction } from '@common/transaction-utils';
import { finalizeTxSignature } from '@common/utils';
import {
  useSignedTransaction,
  useTransactionContractInterface,
  useTransactionContractSource,
  useTransactionFunction,
  useTransactionRequest,
} from '@common/hooks/use-transaction';
import { signedTransactionState } from '@store/transactions';
import { requestTokenPayloadState, requestTokenState } from '@store/transactions/requests';

export function useHandleSubmitPendingTransaction() {
  const { doSetLatestNonce } = useWallet();
  return useRecoilCallback(
    ({ snapshot, set }) =>
      async () => {
        const { tx, pendingTransaction, requestToken, network } = await snapshot.getPromise(
          waitForAll({
            tx: signedTransactionState,
            pendingTransaction: requestTokenPayloadState,
            requestToken: requestTokenState,
            network: currentNetworkState,
          })
        );

        if (!pendingTransaction || !requestToken || !tx) {
          set(transactionBroadcastErrorState, 'No pending transaction found.');
          return;
        }
        try {
          const result = await finishTransaction({
            tx,
            pendingTransaction,
            nodeUrl: network.url,
          });
          await doSetLatestNonce(tx);
          finalizeTxSignature(requestToken, result);
        } catch (error) {
          set(transactionBroadcastErrorState, error.message);
        }
      },
    [doSetLatestNonce]
  );
}

export const useTxState = () => {
  const pendingTransaction = useTransactionRequest();
  const contractInterface = useTransactionContractInterface();
  const pendingTransactionFunction = useTransactionFunction();
  const signedTransaction = useSignedTransaction();
  const contractSource = useTransactionContractSource();
  const handleSubmitPendingTransaction = useHandleSubmitPendingTransaction();

  const broadcastError = useRecoilValue(transactionBroadcastErrorState);
  const isUnauthorizedTransaction = useRecoilValue(isUnauthorizedTransactionState);

  return {
    pendingTransaction,
    signedTransaction,
    contractSource,
    contractInterface,
    pendingTransactionFunction,
    handleSubmitPendingTransaction,
    broadcastError,
    isUnauthorizedTransaction,
  };
};
