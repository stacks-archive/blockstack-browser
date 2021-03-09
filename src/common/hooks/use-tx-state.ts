import { useWallet } from './use-wallet';
import {
  contractSourceStore,
  contractInterfaceStore,
  pendingTransactionStore,
  signedTransactionStore,
  pendingTransactionFunctionSelector,
  transactionBroadcastErrorStore,
  requestTokenStore,
} from '@store/recoil/transaction';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { currentNetworkStore } from '@store/recoil/networks';
import { finishTransaction } from '@common/transaction-utils';
import { useLoadable } from '@common/hooks/use-loadable';
import { finalizeTxSignature } from '@common/utils';

export const useTxState = () => {
  const { doSetLatestNonce } = useWallet();
  const broadcastError = useRecoilValue(transactionBroadcastErrorStore);
  const pendingTransaction = useRecoilValue(pendingTransactionStore);
  const contractSource = useLoadable(contractSourceStore);
  const contractInterface = useLoadable(contractInterfaceStore);
  const pendingTransactionFunction = useLoadable(pendingTransactionFunctionSelector);
  const signedTransaction = useLoadable(signedTransactionStore);

  const doSubmitPendingTransaction = useRecoilCallback(
    ({ snapshot, set }) => async () => {
      const pendingTransaction = await snapshot.getPromise(pendingTransactionStore);
      const requestPayload = await snapshot.getPromise(requestTokenStore);
      if (!pendingTransaction) {
        set(transactionBroadcastErrorStore, 'No pending transaction found.');
        return;
      }
      const tx = await snapshot.getPromise(signedTransactionStore);
      const currentNetwork = await snapshot.getPromise(currentNetworkStore);
      try {
        const result = await finishTransaction({
          tx,
          pendingTransaction,
          nodeUrl: currentNetwork.url,
        });
        await doSetLatestNonce(tx);
        finalizeTxSignature(requestPayload, result);
      } catch (error) {
        set(transactionBroadcastErrorStore, error.message);
      }
    },
    [doSetLatestNonce]
  );

  return {
    pendingTransaction,
    signedTransaction,
    contractSource,
    contractInterface,
    pendingTransactionFunction,
    doSubmitPendingTransaction,
    broadcastError,
  };
};
