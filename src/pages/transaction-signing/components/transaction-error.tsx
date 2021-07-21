import React, { memo } from 'react';
import { useTransactionError } from '@pages/transaction-signing/hooks/use-transaction-error';
import {
  BroadcastErrorMessage,
  ExpiredRequestErrorMessage,
  FeeInsufficientFundsErrorMessage,
  IncorrectContractAddressMessage,
  NoContractErrorMessage,
  StxTransferInsufficientFundsErrorMessage,
  UnauthorizedErrorMessage,
} from '@pages/transaction-signing/components/transaction-errors';

export enum TransactionErrorReason {
  StxTransferInsufficientFunds = 1,
  FeeInsufficientFunds = 2,
  Generic = 3,
  BroadcastError = 4,
  Unauthorized = 5,
  NoContract = 6,
  ExpiredRequest = 7,
  InvalidContractAddress = 8,
}

export const TransactionErrorSuspense = memo(() => {
  const reason = useTransactionError();
  if (!reason) return null;
  switch (reason) {
    case TransactionErrorReason.NoContract:
      return <NoContractErrorMessage />;
    case TransactionErrorReason.InvalidContractAddress:
      return <IncorrectContractAddressMessage />;
    case TransactionErrorReason.StxTransferInsufficientFunds:
      return <StxTransferInsufficientFundsErrorMessage />;
    case TransactionErrorReason.BroadcastError:
      return <BroadcastErrorMessage />;
    case TransactionErrorReason.FeeInsufficientFunds:
      return <FeeInsufficientFundsErrorMessage />;
    case TransactionErrorReason.Unauthorized:
      return <UnauthorizedErrorMessage />;
    case TransactionErrorReason.ExpiredRequest:
      return <ExpiredRequestErrorMessage />;
    default:
      return null;
  }
});

export const TransactionError = memo(() => {
  return (
    <React.Suspense fallback={<></>}>
      <TransactionErrorSuspense />
    </React.Suspense>
  );
});
