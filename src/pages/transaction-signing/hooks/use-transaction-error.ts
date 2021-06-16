import { useTransactionContractInterface } from '@pages/transaction-signing/hooks/use-transaction';
import { useTransactionRequest } from '@common/hooks/use-transaction-request';
import { useWallet } from '@common/hooks/use-wallet';
import { useFetchBalances } from '@common/hooks/account/use-account-info';
import { useMemo } from 'react';
import { TransactionErrorReason } from '@pages/transaction-signing/components/transaction-error';
import BigNumber from 'bignumber.js';
import { TransactionTypes } from '@stacks/connect';
import { useTransactionFee } from '@pages/transaction-signing/hooks/use-transaction-fee';
import { transactionBroadcastErrorState } from '@store/transactions';
import { useOrigin } from '@common/hooks/use-origin';
import { transactionRequestValidationState } from '@store/transactions/requests';
import { useAtomValue } from 'jotai/utils';

export function useTransactionError() {
  const transactionRequest = useTransactionRequest();
  const contractInterface = useTransactionContractInterface();
  const fee = useTransactionFee();
  const broadcastError = useAtomValue(transactionBroadcastErrorState);
  const isValidTransaction = useAtomValue(transactionRequestValidationState);
  const origin = useOrigin();

  const { currentAccount } = useWallet();
  const balances = useFetchBalances();

  // return null;
  return useMemo<TransactionErrorReason | void>(() => {
    if (origin === false) return TransactionErrorReason.ExpiredRequest;
    if (isValidTransaction === false) return TransactionErrorReason.Unauthorized;

    if (!transactionRequest || !balances || !currentAccount) {
      return TransactionErrorReason.Generic;
    }
    if (transactionRequest.txType === TransactionTypes.ContractCall && !contractInterface)
      return TransactionErrorReason.NoContract;
    if (broadcastError) return TransactionErrorReason.BroadcastError;

    if (balances) {
      const stxBalance = new BigNumber(balances.stx.balance);
      const zeroBalance = stxBalance.toNumber() === 0;
      if (transactionRequest.txType === TransactionTypes.STXTransfer) {
        if (zeroBalance) return TransactionErrorReason.StxTransferInsufficientFunds;

        const transferAmount = new BigNumber(transactionRequest.amount);
        if (transferAmount.gte(stxBalance))
          return TransactionErrorReason.StxTransferInsufficientFunds;
      }
      if (zeroBalance) return TransactionErrorReason.FeeInsufficientFunds;
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
