import { useWallet } from '@common/hooks/use-wallet';
import { useAtomCallback, waitForAll } from 'jotai/utils';
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
import { useCallback } from 'react';

export function useTransactionBroadcast() {
  const { doSetLatestNonce } = useWallet();
  return useAtomCallback(
    useCallback(
      async (get, set) => {
        const { account, signedTransaction, attachment, requestToken, network } = await get(
          waitForAll({
            signedTransaction: signedTransactionState,
            account: currentAccountState,
            attachment: transactionAttachmentState,
            requestToken: requestTokenState,
            network: currentNetworkState,
          }),
          true
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
          typeof nonce !== 'undefined' && (await doSetLatestNonce(nonce));
          finalizeTxSignature(requestToken, result);
        } catch (error) {
          console.error(error);
          set(transactionBroadcastErrorState, error.message);
        }
      },
      [doSetLatestNonce]
    )
  );
}
