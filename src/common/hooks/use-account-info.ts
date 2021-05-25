import { accountBalancesState, accountDataState } from '@store/accounts';
import { useLoadable } from './use-loadable';

export const useFetchAccountData = () => {
  return useLoadable(accountDataState);
};

export const useFetchBalances = () => {
  return useLoadable(accountBalancesState);
};
