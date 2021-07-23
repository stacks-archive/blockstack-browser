import { accountBalancesState, currentAccountDataState } from '@store/accounts';
import { useAtomValue } from 'jotai/utils';

export const useFetchAccountData = () => {
  return useAtomValue(currentAccountDataState);
};

export const useFetchBalances = () => {
  return useAtomValue(accountBalancesState);
};
