import { authRequestState } from '@store/onboarding';
import { useAtomValue } from 'jotai/utils';

export function useAuthRequest() {
  return useAtomValue(authRequestState);
}
