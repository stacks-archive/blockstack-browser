import { useAtomCallback } from 'jotai/utils';
import { requestTokenState } from '@store/transactions/requests';
import { finalizeTxSignature } from '@common/utils';
import { transactionBroadcastErrorState } from '@store/transactions';
import { useCallback } from 'react';

export function useOnCancel() {
  return useAtomCallback(
    useCallback(async (get, set) => {
      const requestToken = get(requestTokenState);
      if (!requestToken) {
        set(transactionBroadcastErrorState, 'No pending transaction found.');
        return;
      }
      try {
        const result = 'cancel';
        finalizeTxSignature(requestToken, result);
      } catch (error) {
        set(transactionBroadcastErrorState, error.message);
      }
    }, [])
  );
}
