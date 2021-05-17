import { useFetchAccountData } from '@common/hooks/use-account-info';

export function useAccountBalances() {
  const accountData = useFetchAccountData();

  return accountData?.value?.balances;
}
