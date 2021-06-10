import React, { memo } from 'react';
import { useTransactionRequest } from '@common/hooks/transaction/use-transaction';
import { useOrigin } from '@common/hooks/use-origin';
import { useTransactionPageTitle } from '@common/hooks/transaction/use-transaction-page-title';
import { Stack } from '@stacks/ui';
import { Caption, Title } from '@components/typography';
import { useCurrentNetwork } from '@common/hooks/use-current-network';

export const TransactionPageTop = memo(() => {
  const transactionRequest = useTransactionRequest();
  const origin = useOrigin();
  const pageTitle = useTransactionPageTitle();
  const network = useCurrentNetwork();
  if (!transactionRequest) return null;

  const appName = transactionRequest?.appDetails?.name;

  const testnetAddition = network.isTestnet ? (
    <>
      {' '}
      on <br />
      {network.url}
    </>
  ) : null;

  return (
    <Stack pt="extra-loose" spacing="base">
      <Title fontWeight="bold" as="h1">
        {pageTitle}
      </Title>
      {appName ? (
        <Caption>
          Requested by {appName} {origin ? `(${origin?.split('//')[1]})` : null}
          {testnetAddition}
        </Caption>
      ) : null}
    </Stack>
  );
});
