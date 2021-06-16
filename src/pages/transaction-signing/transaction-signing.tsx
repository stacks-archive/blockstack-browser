import React, { memo } from 'react';
import { PopupHeader } from '@pages/transaction-signing/components/popup-header';
import { PopupContainer } from '@components/popup/container';
import { TransactionsActions } from '@pages/transaction-signing/components/actions';
import { TransactionError } from './components/transaction-error';
import { TransactionPageTop } from '@pages/transaction-signing/components/transaction-page-top';
import { ContractCallDetails } from '@pages/transaction-signing/components/contract-call-details';
import { ContractDeployDetails } from '@pages/transaction-signing/components/contract-deploy-details';
import { PostConditions } from '@pages/transaction-signing/components/post-conditions/list';
import { StxTransferDetails } from '@pages/transaction-signing/components/stx-transfer-details';
import { useTransactionRequest } from '@common/hooks/use-transaction-request';
import { Stack } from '@stacks/ui';

export const TransactionPage = memo(() => {
  const transactionRequest = useTransactionRequest();
  if (!transactionRequest) return null;
  return (
    <PopupContainer header={<PopupHeader />}>
      <Stack spacing="loose">
        <TransactionPageTop />
        <TransactionError />
        <PostConditions />
        {transactionRequest.txType === 'contract_call' && <ContractCallDetails />}
        {transactionRequest.txType === 'token_transfer' && <StxTransferDetails />}
        {transactionRequest.txType === 'smart_contract' && <ContractDeployDetails />}
        <TransactionsActions />
      </Stack>
    </PopupContainer>
  );
});
