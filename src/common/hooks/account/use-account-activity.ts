import { useLoadable } from '@common/hooks/use-loadable';
import { accountTransactionsState } from '@store/accounts';

export function useAccountActivity() {
  return useLoadable(accountTransactionsState);
}
