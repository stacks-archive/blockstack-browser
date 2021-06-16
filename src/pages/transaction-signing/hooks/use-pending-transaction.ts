import { pendingTransactionState } from '@store/transactions';
import { useAtomValue } from 'jotai/utils';

export function usePendingTransaction() {
  return useAtomValue(pendingTransactionState);
}
