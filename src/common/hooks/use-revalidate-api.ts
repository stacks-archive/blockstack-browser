import { useRecoilCallback } from 'recoil';
import { apiRevalidation } from '@store/common/api';

export function useRevalidateApi() {
  return useRecoilCallback(({ snapshot, set }) => async () => {
    const count = await snapshot.getPromise(apiRevalidation);
    set(apiRevalidation, count + 1);
  });
}
