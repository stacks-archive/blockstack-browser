import { useUpdateAtom } from 'jotai/utils';
import { allAccountDataRefreshState } from '@store/accounts';
import { useCallback } from 'react';

export function useRefreshAccountData(delay?: number) {
  const refreshAccountData = useUpdateAtom(allAccountDataRefreshState);
  return useCallback(async () => {
    if (delay) await new Promise(resolve => setTimeout(resolve, delay));
    await refreshAccountData(null);
  }, [delay, refreshAccountData]);
}
