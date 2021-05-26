import React, { memo } from 'react';
import { PopupHeader } from '@components/transactions/popup-header';
import { PopupContainer } from '@components/popup/container';
import { TransactionsActions } from '@components/transactions/actions';
import { TransactionError } from './transaction-error';
import { TransactionPageTop } from '@components/transactions/page-top';
import { ContractCallDetails } from '@components/transactions/contract-call-details';
import { ContractDeployDetails } from '@components/transactions/contract-deploy-details';
import { PostConditions } from '@components/transactions/post-conditions/list';
import { StxTransferDetails } from '@components/transactions/stx-transfer-details';
import { useTransactionRequest } from '@common/hooks/transaction/use-transaction';

export const TransactionPage = memo(() => {
  const transactionRequest = useTransactionRequest();
  if (!transactionRequest) return null;
  return (
    <PopupContainer header={<PopupHeader />}>
      <TransactionPageTop />
      <TransactionError />
      <PostConditions />
      <ContractCallDetails />
      <StxTransferDetails />
      <ContractDeployDetails />
      <TransactionsActions />
    </PopupContainer>
  );
});
