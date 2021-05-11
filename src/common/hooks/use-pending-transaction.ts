import { useRecoilValue } from 'recoil';
import { pendingTransactionStore } from '@store/transaction';

export function usePendingTransaction() {
  return useRecoilValue(pendingTransactionStore);
}
