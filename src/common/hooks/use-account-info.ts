import { accountBalancesStore, accountDataStore } from '@store/recoil/api';
import { useLoadable } from './use-loadable';

export const useFetchAccountData = () => {
  return useLoadable(accountDataStore);
};

export const useFetchBalances = () => {
  return useLoadable(accountBalancesStore);
};
