import { useUpdateAtom } from 'jotai/utils';
import { allAccountDataRefreshState } from '@store/accounts';
import { useCallback } from 'react';
import { delay } from '@common/utils';

export function useRefreshAccountData(ms?: number) {
  const refreshAccountData = useUpdateAtom(allAccountDataRefreshState);
  return useCallback(async () => {
    if (typeof ms === 'number') await delay(ms);
    await refreshAccountData(null);
  }, [ms, refreshAccountData]);
}
