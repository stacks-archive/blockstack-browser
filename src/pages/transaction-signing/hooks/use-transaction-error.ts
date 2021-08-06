import { useTransactionContractInterface } from '@pages/transaction-signing/hooks/use-transaction';
import { useTransactionRequest } from '@common/hooks/use-transaction-request';
import { useWallet } from '@common/hooks/use-wallet';
import { useMemo } from 'react';
import { TransactionErrorReason } from '@pages/transaction-signing/components/transaction-error';
import BigNumber from 'bignumber.js';
import { TransactionTypes } from '@stacks/connect';
import { useTransactionFee } from '@pages/transaction-signing/hooks/use-transaction-fee';
import { transactionBroadcastErrorState } from '@store/transactions';
import { useOrigin } from '@common/hooks/use-origin';
import { transactionRequestValidationState } from '@store/transactions/requests';
import { useAtomValue } from 'jotai/utils';
import { validateStacksAddress } from '@common/stacks-utils';
import { useCurrentAccountAvailableStxBalance } from '@common/hooks/use-available-stx-balance';

export function useTransactionError() {
  const transactionRequest = useTransactionRequest();
  const contractInterface = useTransactionContractInterface();
  const fee = useTransactionFee();
  const broadcastError = useAtomValue(transactionBroadcastErrorState);
  const isValidTransaction = useAtomValue(transactionRequestValidationState);
  const origin = useOrigin();

  const { currentAccount } = useWallet();
  const availableStxBalance = useCurrentAccountAvailableStxBalance();

  // return null;
  return useMemo<TransactionErrorReason | void>(() => {
    if (origin === false) return TransactionErrorReason.ExpiredRequest;
    if (isValidTransaction === false) return TransactionErrorReason.Unauthorized;

    if (!transactionRequest || !availableStxBalance || !currentAccount) {
      return TransactionErrorReason.Generic;
    }
    if (transactionRequest.txType === TransactionTypes.ContractCall) {
      if (!validateStacksAddress(transactionRequest.contractAddress))
        return TransactionErrorReason.InvalidContractAddress;
      if (!contractInterface) return TransactionErrorReason.NoContract;
    }
    if (broadcastError) return TransactionErrorReason.BroadcastError;

    if (availableStxBalance) {
      const zeroBalance = availableStxBalance.toNumber() === 0;
      if (transactionRequest.txType === TransactionTypes.STXTransfer) {
        if (zeroBalance) return TransactionErrorReason.StxTransferInsufficientFunds;

        const transferAmount = new BigNumber(transactionRequest.amount);
        if (transferAmount.gte(availableStxBalance))
          return TransactionErrorReason.StxTransferInsufficientFunds;
      }
      if (zeroBalance) return TransactionErrorReason.FeeInsufficientFunds;
      if (fee && !fee.isSponsored && fee.amount) {
        const feeAmount = new BigNumber(fee.amount);
        if (feeAmount.gte(availableStxBalance)) return TransactionErrorReason.FeeInsufficientFunds;
      }
    }
    return;
  }, [
    fee,
    broadcastError,
    contractInterface,
    availableStxBalance,
    currentAccount,
    transactionRequest,
    isValidTransaction,
    origin,
  ]);
}
