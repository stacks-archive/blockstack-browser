import React, { memo, useCallback } from 'react';
import { Box, Button, color, Stack, StackProps } from '@stacks/ui';
import { LOADING_KEYS, useLoading } from '@common/hooks/use-loading';
import { SpaceBetween } from '@components/space-between';
import { Caption } from '@components/typography';
import { NetworkRowItem } from '@components/network-row-item';
import { FeeComponent } from '@pages/transaction-signing/components/fee';
import { FiAlertTriangle } from 'react-icons/fi';
import { useRecoilValue } from 'recoil';
import { useTransactionBroadcast } from '@pages/transaction-signing/hooks/use-transaction-broadcast';
import { transactionBroadcastErrorState } from '@store/transactions';
import { useTransactionError } from '../hooks/use-transaction-error';
import { useSignedTransaction } from '../hooks/use-transaction';
import { TransactionErrorReason } from './transaction-error';

const MinimalErrorMessage = memo((props: StackProps) => {
  const error = useTransactionError();
  const broadcastError = useRecoilValue(transactionBroadcastErrorState);

  if (!error) return null;

  const getTitle = () => {
    if (error) {
      switch (error) {
        case TransactionErrorReason.Unauthorized:
          return 'Unauthorized request';
        case TransactionErrorReason.NoContract:
          return 'Contract not found';
        case TransactionErrorReason.StxTransferInsufficientFunds:
        case TransactionErrorReason.FeeInsufficientFunds:
          return 'Insufficient balance';
        case TransactionErrorReason.BroadcastError:
          return `Broadcast error: ${JSON.stringify(broadcastError)}`;
        case TransactionErrorReason.Generic:
          return 'Something went wrong';
      }
    }
    return null;
  };
  return (
    <Stack alignItems="center" bg="#FCEEED" p="base" borderRadius="12px" isInline {...props}>
      <Box color={color('feedback-error')} strokeWidth={2} as={FiAlertTriangle} />
      <Caption color={color('feedback-error')}>{getTitle()}</Caption>
    </Stack>
  );
});

export const TransactionsActions = memo((props: StackProps) => {
  const handleBroadcastTransaction = useTransactionBroadcast();
  const signedTransaction = useSignedTransaction();
  const error = useTransactionError();
  const { setIsLoading, setIsIdle, isLoading } = useLoading(LOADING_KEYS.SUBMIT_TRANSACTION);

  const isDisabled = !!error || !signedTransaction.value;

  const handleSubmit = useCallback(async () => {
    setIsLoading();
    await handleBroadcastTransaction();
    setIsIdle();
  }, [setIsLoading, setIsIdle, handleBroadcastTransaction]);

  return (
    <Stack mt="auto" pt="loose" spacing="loose" bg={color('bg')} {...props}>
      <Stack spacing="base-loose">
        <SpaceBetween>
          <Caption>Fees</Caption>
          <Caption>
            <FeeComponent />
          </Caption>
        </SpaceBetween>
        <SpaceBetween>
          <Caption>Network</Caption>
          <NetworkRowItem />
        </SpaceBetween>
      </Stack>
      <MinimalErrorMessage />
      <Button
        borderRadius="12px"
        py="base"
        width="100%"
        onClick={handleSubmit}
        isLoading={isLoading}
        isDisabled={isDisabled}
      >
        Confirm
      </Button>
    </Stack>
  );
});
