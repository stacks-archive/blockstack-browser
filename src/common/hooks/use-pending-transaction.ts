import { useRecoilValue } from 'recoil';
import { pendingTransactionState } from '@store/transactions';

export function usePendingTransaction() {
  return useRecoilValue(pendingTransactionState);
}
