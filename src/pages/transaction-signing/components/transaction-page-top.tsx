import React, { memo } from 'react';
import { useTransactionRequest } from '@common/hooks/use-transaction-request';
import { useOrigin } from '@common/hooks/use-origin';
import { useTransactionPageTitle } from '@pages/transaction-signing/hooks/use-transaction-page-title';
import { Stack } from '@stacks/ui';
import { Caption, Title } from '@components/typography';
import { useCurrentNetwork } from '@common/hooks/use-current-network';
import { getUrlHostname } from '@common/utils';

export const TransactionPageTop = memo(() => {
  const transactionRequest = useTransactionRequest();
  const origin = useOrigin();
  const pageTitle = useTransactionPageTitle();
  const network = useCurrentNetwork();
  if (!transactionRequest) return null;
  const appName = transactionRequest?.appDetails?.name;
  const originAddition = origin ? ` (${getUrlHostname(origin)})` : '';
  const testnetAddition = network.isTestnet ? ` using ${getUrlHostname(network.url)}` : '';
  const caption = appName ? `Requested by "${appName}"${originAddition}${testnetAddition}` : null;

  return (
    <Stack pt="extra-loose" spacing="base">
      <Title fontWeight="bold" as="h1">
        {pageTitle}
      </Title>
      {caption && <Caption wordBreak="break-word">{caption}</Caption>}
    </Stack>
  );
});
