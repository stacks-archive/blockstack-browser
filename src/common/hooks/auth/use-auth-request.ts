import { useRecoilValue } from 'recoil';
import { authRequestState } from '@store/onboarding';

export function useAuthRequest() {
  return useRecoilValue(authRequestState);
}
