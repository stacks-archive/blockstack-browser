import { useState, useEffect, useCallback } from 'react';
import { useWallet } from './use-wallet';
import { useLocation } from 'react-router-dom';
import {
  contractSourceStore,
  contractInterfaceStore,
  pendingTransactionStore,
  signedTransactionStore,
  requestTokenStore,
  pendingTransactionFunctionSelector,
  transactionBroadcastErrorStore,
} from '@store/recoil/transaction';
import { useRecoilCallback, useRecoilValue, useSetRecoilState } from 'recoil';
import { currentNetworkStore } from '@store/recoil/networks';
import { finishTransaction } from '@common/transaction-utils';
import { useLoadable } from '@common/hooks/use-loadable';
import { finalizeTxSignature } from '@common/utils';

export const useTxState = () => {
  const location = useLocation();
  const { currentAccount, doSetLatestNonce } = useWallet();
  const [error, setError] = useState<string | null>(null);
  const broadcastError = useRecoilValue(transactionBroadcastErrorStore);
  const pendingTransaction = useRecoilValue(pendingTransactionStore);
  const contractSource = useLoadable(contractSourceStore);
  const contractInterface = useLoadable(contractInterfaceStore);
  const pendingTransactionFunction = useLoadable(pendingTransactionFunctionSelector);
  const signedTransaction = useLoadable(signedTransactionStore);
  const requestToken = useRecoilValue(requestTokenStore);
  const setRequestToken = useSetRecoilState(requestTokenStore);

  if (!currentAccount) {
    throw new Error('User must be logged in.');
  }

  const decodeRequest = useCallback(() => {
    const urlParams = new URLSearchParams(location.search);
    const _requestToken = urlParams.get('request');
    if (_requestToken) {
      setRequestToken(_requestToken);
    } else if (!requestToken) {
      setError('Unable to decode request');
      console.error('Unable to find contract call parameter');
    }
  }, [location.search, setRequestToken, requestToken]);

  const doSubmitPendingTransaction = useRecoilCallback(
    ({ snapshot, set }) => async () => {
      const pendingTransaction = await snapshot.getPromise(pendingTransactionStore);
      if (!pendingTransaction) {
        set(transactionBroadcastErrorStore, 'No pending transaction found.');
        return;
      }
      const tx = await snapshot.getPromise(signedTransactionStore);
      const currentNetwork = await snapshot.getPromise(currentNetworkStore);
      try {
        const result = await finishTransaction({
          tx,
          pendingTransaction,
          nodeUrl: currentNetwork.url,
        });
        doSetLatestNonce(tx);
        finalizeTxSignature(result);
      } catch (error) {
        set(transactionBroadcastErrorStore, error.message);
      }
    },
    [doSetLatestNonce]
  );

  useEffect(() => {
    decodeRequest();
  }, [decodeRequest]);

  return {
    pendingTransaction,
    signedTransaction,
    contractSource,
    error,
    contractInterface,
    pendingTransactionFunction,
    doSubmitPendingTransaction,
    broadcastError,
  };
};
