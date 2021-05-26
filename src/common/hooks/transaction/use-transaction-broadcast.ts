import { useWallet } from '@common/hooks/use-wallet';
import { useRecoilCallback, waitForAll } from 'recoil';
import { currentAccountState } from '@store/accounts';
import {
  pendingTransactionState,
  signedTransactionState,
  transactionBroadcastErrorState,
} from '@store/transactions';
import { requestTokenState } from '@store/transactions/requests';
import { currentNetworkState } from '@store/networks';
import { finalizeTxSignature } from '@common/utils';
import { handleBroadcastTransaction } from '@common/transactions/transactions';

export function useTransactionBroadcast() {
  const { doSetLatestNonce } = useWallet();
  return useRecoilCallback(
    ({ snapshot, set }) =>
      async () => {
        const { account, signedTransaction, pendingTransaction, requestToken, network } =
          await snapshot.getPromise(
            waitForAll({
              signedTransaction: signedTransactionState,
              account: currentAccountState,
              pendingTransaction: pendingTransactionState,
              requestToken: requestTokenState,
              network: currentNetworkState,
            })
          );

        if (!pendingTransaction || !account || !requestToken || !signedTransaction) {
          set(transactionBroadcastErrorState, 'No pending transaction found.');
          return;
        }

        try {
          const result = await handleBroadcastTransaction(
            signedTransaction,
            pendingTransaction,
            network.url
          );
          await doSetLatestNonce(signedTransaction);
          finalizeTxSignature(requestToken, result);
        } catch (error) {
          set(transactionBroadcastErrorState, error.message);
        }
      },
    [doSetLatestNonce]
  );
}
