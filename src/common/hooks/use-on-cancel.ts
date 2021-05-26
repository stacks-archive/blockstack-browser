import { useRecoilCallback } from 'recoil';
import { requestTokenState } from '@store/transactions/requests';
import { finalizeTxSignature } from '@common/utils';
import { transactionBroadcastErrorState } from '@store/transactions';

export function useOnCancel() {
  return useRecoilCallback(({ snapshot, set }) => async () => {
    const requestToken = await snapshot.getPromise(requestTokenState);
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
  });
}
