import {
  useTransactionContractInterface,
  useTransactionRequest,
} from '@pages/transaction-signing/hooks/use-transaction';
import { useRecoilValue } from 'recoil';
import { useWallet } from '@common/hooks/use-wallet';
import { useFetchBalances } from '@common/hooks/account/use-account-info';
import { useMemo } from 'react';
import { TransactionErrorReason } from '@pages/transaction-signing/components/transaction-error';
import BigNumber from 'bignumber.js';
import { TransactionTypes } from '@stacks/connect';
import { useTransactionFee } from '@pages/transaction-signing/hooks/use-transaction-fee';
import { transactionBroadcastErrorState } from '@store/transactions';
import { useOrigin } from '@common/hooks/use-origin';
import { useLoadable } from '@common/hooks/use-loadable';
import { transactionRequestValidationState } from '@store/transactions/requests';

export function useTransactionError() {
  const transactionRequest = useTransactionRequest();
  const fee = useTransactionFee();
  const contractInterface = useTransactionContractInterface();
  const broadcastError = useRecoilValue(transactionBroadcastErrorState);
  const isValidTransaction = useLoadable(transactionRequestValidationState);
  const origin = useOrigin();

  const { currentAccount } = useWallet();
  const balances = useFetchBalances();
  return useMemo<TransactionErrorReason | void>(() => {
    if (origin === false) return TransactionErrorReason.ExpiredRequest;
    if (isValidTransaction.contents === false && !isValidTransaction.isLoading)
      return TransactionErrorReason.Unauthorized;

    if (!transactionRequest || balances.errorMaybe() || !currentAccount) {
      return TransactionErrorReason.Generic;
    }
    if (
      transactionRequest.txType === TransactionTypes.ContractCall &&
      !contractInterface.isLoading &&
      !contractInterface.contents
    )
      return TransactionErrorReason.NoContract;
    if (broadcastError) return TransactionErrorReason.BroadcastError;

    if (balances.value) {
      const stxBalance = new BigNumber(balances.value.stx.balance);
      if (transactionRequest.txType === TransactionTypes.STXTransfer) {
        const transferAmount = new BigNumber(transactionRequest.amount);
        if (transferAmount.gte(stxBalance))
          return TransactionErrorReason.StxTransferInsufficientFunds;
      }
      if (fee && !fee.isSponsored && fee.amount) {
        const feeAmount = new BigNumber(fee.amount);
        if (feeAmount.gte(stxBalance)) return TransactionErrorReason.FeeInsufficientFunds;
      }
    }
    return;
  }, [
    fee,
    broadcastError,
    contractInterface,
    balances,
    currentAccount,
    transactionRequest,
    isValidTransaction,
    origin,
  ]);
}
