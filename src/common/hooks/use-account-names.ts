import { accountNameState } from '@store/names';
import { useLoadable } from '@common/hooks/use-loadable';

export function useAccountNames() {
  return useLoadable(accountNameState);
}
