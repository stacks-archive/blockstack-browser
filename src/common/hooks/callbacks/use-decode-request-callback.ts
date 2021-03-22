import { useRecoilCallback } from 'recoil';
import { requestTokenStore } from '@store/recoil/transaction';
import { useLocation } from 'react-router-dom';

export function useDecodeRequestCallback() {
  const location = useLocation();
  return useRecoilCallback(
    ({ set }) => () => {
      const urlParams = new URLSearchParams(location.search);
      const requestToken = urlParams.get('request');
      if (requestToken) {
        set(requestTokenStore, requestToken);
      } else if (!requestToken) {
        console.error('Unable to find contract call parameter');
        throw 'Invalid transaction request parameter';
      }
    },
    [location.search]
  );
}
