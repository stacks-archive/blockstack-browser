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
} from '@store/recoil/transaction';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { currentNetworkStore } from '@store/recoil/networks';
import { finishTransaction } from '@common/transaction-utils';
import { useLoadable } from '@common/hooks/use-loadable';

export const useTxState = () => {
  const location = useLocation();
  const { currentIdentity, doSetLatestNonce } = useWallet();
  const [error, setError] = useState<string | null>(null);
  const pendingTransaction = useRecoilValue(pendingTransactionStore);
  const contractSource = useLoadable(contractSourceStore);
  const contractInterface = useLoadable(contractInterfaceStore);
  const pendingTransactionFunction = useLoadable(pendingTransactionFunctionSelector);
  const signedTransaction = useLoadable(signedTransactionStore);
  const requestToken = useRecoilValue(requestTokenStore);
  const setRequestToken = useSetRecoilState(requestTokenStore);
  const currentNetwork = useRecoilValue(currentNetworkStore);

  if (!currentIdentity) {
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

  const doSubmitPendingTransaction = useCallback(async () => {
    if (!pendingTransaction || signedTransaction.state !== 'hasValue') return;
    const tx = signedTransaction.contents;
    await finishTransaction({ tx, pendingTransaction, nodeUrl: currentNetwork.url });
    doSetLatestNonce(tx);
  }, [pendingTransaction, signedTransaction, currentNetwork.url, doSetLatestNonce]);

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
  };
};
