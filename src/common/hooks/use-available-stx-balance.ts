import { useAtomValue } from 'jotai/utils';
import {
  accountAvailableStxBalanceState,
  currentAccountAvailableStxBalanceState,
} from '@store/accounts';

export const useAccountAvailableStxBalance = (address: string) => {
  return useAtomValue(accountAvailableStxBalanceState(address));
};

export function useCurrentAccountAvailableStxBalance() {
  return useAtomValue(currentAccountAvailableStxBalanceState);
}
