import { useRecoilCallback } from 'recoil';
import { isUnauthorizedTransactionStore, requestTokenStore } from '@store/recoil/transaction';
import { useLocation } from 'react-router-dom';
import { walletStore } from '@store/recoil/wallet';
import { getRequestOrigin, StorageKey } from '@extension/storage';
import { verifyTxRequest } from '@common/transaction-utils';

export function useDecodeRequestCallback() {
  const location = useLocation();
  return useRecoilCallback(
    ({ set, snapshot }) => async () => {
      const urlParams = new URLSearchParams(location.search);
      const requestToken = urlParams.get('request');
      if (!requestToken) {
        throw 'Invalid transaction request parameter';
      }

      const wallet = await snapshot.getPromise(walletStore);
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
