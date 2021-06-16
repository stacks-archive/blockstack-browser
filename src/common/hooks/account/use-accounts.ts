import { useAtomValue } from 'jotai/utils';
import { accountsWithAddressState } from '@store/accounts';

export function useAccounts() {
  return useAtomValue(accountsWithAddressState);
}
