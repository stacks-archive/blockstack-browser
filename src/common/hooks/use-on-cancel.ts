import { useRecoilCallback } from 'recoil';
import { requestTokenStore, transactionBroadcastErrorStore } from '@store/transaction';
import { finalizeTxSignature } from '@common/utils';

export function useOnCancel() {
  return useRecoilCallback(({ snapshot, set }) => async () => {
    const requestPayload = await snapshot.getPromise(requestTokenStore);
    if (!requestPayload) {
      set(transactionBroadcastErrorStore, 'No pending transaction found.');
      return;
    }
    try {
      const result = 'cancel';
      finalizeTxSignature(requestPayload, result);
    } catch (error) {
      set(transactionBroadcastErrorStore, error.message);
    }
  });
}
