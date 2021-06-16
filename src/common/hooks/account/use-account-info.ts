import { accountBalancesState, accountDataState } from '@store/accounts';
import { useAtomValue } from 'jotai/utils';

export const useFetchAccountData = () => {
  return useAtomValue(accountDataState);
};

export const useFetchBalances = () => {
  return useAtomValue(accountBalancesState);
};
