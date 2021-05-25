import React, { memo } from 'react';
import { useCurrentAccount } from '@common/hooks/use-current-account';
import { color, Stack, useClipboard } from '@stacks/ui';
import { useTransactionRequest } from '@common/hooks/use-transaction';
import { useFetchBalances } from '@common/hooks/use-account-info';
import { Caption } from '@components/typography';
import { SpaceBetween } from '@components/space-between';
import { stacksValue } from '@common/stacks-utils';
import { STXTransferPayload, TransactionTypes } from '@stacks/connect';
import { useCurrentNetwork } from '@common/hooks/use-current-network';
import { truncateMiddle } from '@stacks/ui-utils';
import { useTxState } from '@common/hooks/use-tx-state';
import { ErrorMessage } from '@components/transactions/error';
import { useDrawers } from '@common/hooks/use-drawers';

export const FeeInsufficientFundsErrorMessage = memo(props => {
  const currentAccount = useCurrentAccount();
  const { setShowAccounts } = useDrawers();
  const { onCopy, hasCopied } = useClipboard(currentAccount.address || '');
  return (
    <ErrorMessage
      title="Insufficient balance"
      body={`You do not have enough STX to cover the network fees for this transaction.`}
      actions={[
        { onClick: () => setShowAccounts(true), label: 'Switch account' },
        { onClick: () => onCopy(), label: hasCopied ? 'Copied!' : 'Copy address' },
      ]}
      {...props}
    />
  );
});

export const StxTransferInsufficientFundsErrorMessage = memo(props => {
  const pendingTransaction = useTransactionRequest();
  const balances = useFetchBalances();
  const currentAccount = useCurrentAccount();
  const { setShowAccounts } = useDrawers();
  const { onCopy, hasCopied } = useClipboard(currentAccount.address || '');
  return (
    <ErrorMessage
      title="Insufficient balance"
      body={
        <Stack spacing="loose">
          <Caption color={color('text-body')}>
            You don't have enough STX to make this transfer. Send some STX to this address, or
            switch to another account.
          </Caption>

          <Stack spacing="base" justifyContent="flex-end" textAlign="right">
            <SpaceBetween>
              <Caption>Current balance</Caption>
              <Caption>
                {balances?.value?.stx?.balance
                  ? stacksValue({
                      value: balances?.value?.stx?.balance,
                      withTicker: true,
                    })
                  : '--'}
              </Caption>
            </SpaceBetween>
            <SpaceBetween>
              <Caption>Transfer amount</Caption>
              <Caption>
                {stacksValue({
                  value: (pendingTransaction as STXTransferPayload).amount,
                  withTicker: true,
                })}
              </Caption>
            </SpaceBetween>
          </Stack>
        </Stack>
      }
      actions={[
        { onClick: () => setShowAccounts(true), label: 'Switch account' },
        { onClick: () => onCopy(), label: hasCopied ? 'Copied!' : 'Copy address' },
      ]}
      {...props}
    />
  );
});

export const NoContractErrorMessage = memo(props => {
  const network = useCurrentNetwork();
  const pendingTransaction = useTransactionRequest();

  if (!pendingTransaction || pendingTransaction.txType !== TransactionTypes.ContractCall)
    return null;
  return (
    <ErrorMessage
      title="Contract not found"
      body={`The contract (${truncateMiddle(pendingTransaction.contractAddress)}.${
        pendingTransaction.contractName
      }) that you are trying to call cannot be found on ${network.mode}.`}
      actions={[{ onClick: () => window.close(), label: 'Switch network' }]}
      {...props}
    />
  );
});

export const UnauthorizedErrorMessage = memo(props => {
  return (
    <ErrorMessage
      title="Unauthorized request"
      body="The transaction request was not properly authorized by any of your accounts. If you've logged in to this app before, then you might need to re-authenticate into this application before attempting to sign a transaction with the Stacks Wallet."
      {...props}
    />
  );
});

export const BroadcastErrorMessage = memo(props => {
  const { broadcastError } = useTxState();
  if (!broadcastError) return null;
  return (
    <ErrorMessage
      title="There was an error when broadcasting this transaction:"
      body={broadcastError}
      {...props}
    />
  );
});
