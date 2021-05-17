import { useLoadable } from '@common/hooks/use-loadable';
import { accountTransactionsState } from '@store/activity';

export function useAccountActivity() {
  return useLoadable(accountTransactionsState);
}
