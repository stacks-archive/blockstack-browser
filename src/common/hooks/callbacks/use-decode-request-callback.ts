import { useRecoilCallback } from 'recoil';
import { isUnauthorizedTransactionStore, requestTokenStore } from '@store/transaction';
import { useLocation } from 'react-router-dom';
import { getRequestOrigin, StorageKey } from 'storage';
import { walletState } from '@store/wallet';

import { verifyTxRequest } from '@common/transaction-utils';

export function useDecodeRequestCallback() {
  const location = useLocation();
  return useRecoilCallback(
    ({ set, snapshot }) =>
      async () => {
        const urlParams = new URLSearchParams(location.search);
        const requestToken = urlParams.get('request');
        if (!requestToken) {
          throw 'Invalid transaction request parameter';
        }

        const wallet = await snapshot.getPromise(walletState);
        const origin = getRequestOrigin(StorageKey.transactionRequests, requestToken);
        if (!wallet || !origin) return;

        try {
          // This function throws if tx is invalid
          await verifyTxRequest({
            requestToken,
            wallet,
            appDomain: origin,
          });
          set(requestTokenStore, requestToken);
        } catch (error) {
          console.error(error);
          set(isUnauthorizedTransactionStore, true);
        }
      },
    [location.search]
  );
}
