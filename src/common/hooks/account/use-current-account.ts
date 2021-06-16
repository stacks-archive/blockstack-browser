import { currentAccountState } from '@store/accounts';
import { useAtomValue } from 'jotai/utils';

export function useCurrentAccount() {
  return useAtomValue(currentAccountState);
}
