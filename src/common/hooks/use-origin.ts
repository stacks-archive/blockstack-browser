import { useRecoilValue } from 'recoil';
import { requestTokenOriginState } from '@store/transactions/requests';

export function useOrigin() {
  return useRecoilValue(requestTokenOriginState);
}
