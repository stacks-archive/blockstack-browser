import { useRecoilValue } from 'recoil';
import { getRequestOrigin, StorageKey } from '@common/storage';
import { requestTokenState } from '@store/transactions/requests';

export function useOrigin() {
  const requestToken = useRecoilValue(requestTokenState);
  return requestToken ? getRequestOrigin(StorageKey.transactionRequests, requestToken) : null;
}
