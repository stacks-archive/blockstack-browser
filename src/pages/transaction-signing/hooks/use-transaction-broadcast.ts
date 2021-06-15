import { useWallet } from '@common/hooks/use-wallet';
import { useRecoilCallback, waitForAll } from 'recoil';
import { currentAccountState } from '@store/accounts';
import {
  transactionAttachmentState,
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
        const { account, signedTransaction, attachment, requestToken, network } =
          await snapshot.getPromise(
            waitForAll({
              signedTransaction: signedTransactionState,
              account: currentAccountState,
              attachment: transactionAttachmentState,
              requestToken: requestTokenState,
              network: currentNetworkState,
            })
          );

        if (!account || !requestToken || !signedTransaction) {
          set(transactionBroadcastErrorState, 'No pending transaction found.');
          return;
        }

        try {
          const { isSponsored, serialized, txRaw, nonce } = signedTransaction;
          const result = await handleBroadcastTransaction({
            isSponsored,
            serialized,
            txRaw,
            attachment,
            networkUrl: network.url,
          });
          await doSetLatestNonce(nonce);
          finalizeTxSignature(requestToken, result);
        } catch (error) {
          console.error(error);
          set(transactionBroadcastErrorState, error.message);
        }
      },
    [doSetLatestNonce]
  );
}
