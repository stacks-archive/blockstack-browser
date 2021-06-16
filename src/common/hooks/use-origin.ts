import { useAtomValue } from 'jotai/utils';
import { requestTokenOriginState } from '@store/transactions/requests';

export function useOrigin() {
  return useAtomValue(requestTokenOriginState);
}
