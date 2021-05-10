import { accountBalancesStore, accountDataStore } from '@store/api';
import { useLoadable } from './use-loadable';

export const useFetchAccountData = () => {
  return useLoadable(accountDataStore);
};

export const useFetchBalances = () => {
  return useLoadable(accountBalancesStore);
};
