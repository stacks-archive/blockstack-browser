import React, { memo } from 'react';
import { useTransactionRequest } from '@common/hooks/transaction/use-transaction';
import { useOrigin } from '@common/hooks/use-origin';
import { useTransactionPageTitle } from '@common/hooks/transaction/use-transaction-page-title';
import { Stack } from '@stacks/ui';
import { Caption, Title } from '@components/typography';

export const TransactionPageTop = memo(() => {
  const transactionRequest = useTransactionRequest();
  const origin = useOrigin();
  const pageTitle = useTransactionPageTitle();
  if (!transactionRequest) return null;

  const appName = transactionRequest?.appDetails?.name;
  return (
    <Stack pt="extra-loose" spacing="base">
      <Title fontWeight="bold" as="h1">
        {pageTitle}
      </Title>
      {appName ? (
        <Caption>
          Requested by {appName} {origin ? `(${origin?.split('//')[1]})` : null}
        </Caption>
      ) : null}
    </Stack>
  );
});
