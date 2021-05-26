import React, { memo } from 'react';
import { useTransactionError } from '@common/hooks/transaction/use-transaction-error';
import {
  BroadcastErrorMessage,
  FeeInsufficientFundsErrorMessage,
  NoContractErrorMessage,
  StxTransferInsufficientFundsErrorMessage,
  UnauthorizedErrorMessage,
} from '@components/transactions/transaction-errors';

export enum TransactionErrorReason {
  StxTransferInsufficientFunds = 1,
  FeeInsufficientFunds = 2,
  Generic = 3,
  BroadcastError = 4,
  Unauthorized = 5,
  NoContract = 6,
}

export const TransactionError = memo(() => {
  const reason = useTransactionError();
  if (!reason) return null;
  switch (reason) {
    case TransactionErrorReason.NoContract:
      return <NoContractErrorMessage />;
    case TransactionErrorReason.StxTransferInsufficientFunds:
      return <StxTransferInsufficientFundsErrorMessage />;
    case TransactionErrorReason.BroadcastError:
      return <BroadcastErrorMessage />;
    case TransactionErrorReason.FeeInsufficientFunds:
      return <FeeInsufficientFundsErrorMessage />;
    case TransactionErrorReason.Unauthorized:
      return <UnauthorizedErrorMessage />;
    default:
      return null;
  }
});
