import { useUpdateAtom } from 'jotai/utils';
import { allAccountDataRefreshState } from '@store/accounts';
import { useCallback } from 'react';
import { delay } from '@common/utils';

export function useRefreshAllAccountData() {
  const update = useUpdateAtom(allAccountDataRefreshState);
  return useCallback(
    async (ms?: number) => {
      if (typeof ms === 'number') await delay(ms);
      await update(null);
    },
    [update]
  );
}
