import { useFetchAccountData } from '@common/hooks/account/use-account-info';
import { useAtomValue } from 'jotai/utils';
import { accountInfoState } from '@store/accounts';

export function useAccountBalances() {
  const accountData = useFetchAccountData();
  return accountData?.balances;
}

export function useAccountInfo() {
  return useAtomValue(accountInfoState);
}
