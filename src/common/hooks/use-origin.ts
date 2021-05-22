import { getRequestOrigin, StorageKey } from 'storage';
import { useRecoilValue } from 'recoil';
import { requestTokenStore } from '@store/transaction';

export function useOrigin() {
  const requestToken = useRecoilValue(requestTokenStore);
  if (!requestToken) return null;
  try {
    return getRequestOrigin(StorageKey.transactionRequests, requestToken);
  } catch (e) {
    return null;
  }
}
