import { accountBalancesStore, accountDataStore } from '@store/recoil/api';
import { useLoadable } from './use-loadable';

export const useFetchAccountData = () => {
  const accountData = useLoadable(accountDataStore);
  return accountData;
};

export const useFetchBalances = () => {
  const accountBalances = useLoadable(accountBalancesStore);
  return accountBalances;
};
