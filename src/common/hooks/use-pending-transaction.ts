import { useAtomValue } from 'jotai/utils';
import { pendingTransactionState } from '@store/transactions';

export function usePendingTransaction() {
  return useAtomValue(pendingTransactionState);
}
