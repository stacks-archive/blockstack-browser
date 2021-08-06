import React, { memo } from 'react';
import { useAtomValue } from 'jotai/utils';
import { useCurrentAccount } from '@common/hooks/account/use-current-account';
import { color, Stack, useClipboard, Fade, Flex } from '@stacks/ui';
import { useTransactionRequest } from '@common/hooks/use-transaction-request';
import { Caption } from '@components/typography';
import { SpaceBetween } from '@components/space-between';
import { stacksValue } from '@common/stacks-utils';
import { STXTransferPayload, TransactionTypes } from '@stacks/connect';
import { useCurrentNetwork } from '@common/hooks/use-current-network';
import { truncateMiddle } from '@stacks/ui-utils';
import { ErrorMessage } from '@pages/transaction-signing/components/error';
import { useDrawers } from '@common/hooks/use-drawers';

import { transactionBroadcastErrorState } from '@store/transactions';
import { useScrollLock } from '@common/hooks/use-scroll-lock';
import { useCurrentAccountAvailableStxBalance } from '@common/hooks/use-available-stx-balance';

export const FeeInsufficientFundsErrorMessage = memo(props => {
  const currentAccount = useCurrentAccount();
  const { setShowAccounts } = useDrawers();
  const { onCopy, hasCopied } = useClipboard(currentAccount?.address || '');
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
  const availableStxBalance = useCurrentAccountAvailableStxBalance();
  const currentAccount = useCurrentAccount();
  const { setShowAccounts } = useDrawers();
  const { onCopy, hasCopied } = useClipboard(currentAccount?.address || '');
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
                {availableStxBalance
                  ? stacksValue({
                      value: availableStxBalance,
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
      {...props}
    />
  );
});
export const IncorrectContractAddressMessage = memo(props => {
  const pendingTransaction = useTransactionRequest();

  if (!pendingTransaction || pendingTransaction.txType !== TransactionTypes.ContractCall)
    return null;
  return (
    <ErrorMessage
      title="Invalid contract address"
      body={`The contract address (${truncateMiddle(
        pendingTransaction.contractAddress
      )}) that you are trying to call is not a valid Stacks address.`}
      {...props}
    />
  );
});

export const UnauthorizedErrorMessage = memo(props => {
  useScrollLock(true);
  return (
    <Fade in>
      {styles => (
        <Flex
          position="absolute"
          width="100%"
          height="100vh"
          zIndex={99}
          left={0}
          top={0}
          alignItems="center"
          justifyContent="center"
          p="loose"
          bg="rgba(0,0,0,0.35)"
          backdropFilter="blur(10px)"
          style={styles}
        >
          <ErrorMessage
            title="Unauthorized request"
            body="The transaction request was not properly authorized by any of your accounts. If you've logged in to this app before, then you might need to re-authenticate into this application before attempting to sign a transaction with the Hiro Wallet."
            border={'1px solid'}
            borderColor={color('border')}
            boxShadow="high"
            css={{
              '& > *': {
                pointerEvents: 'all',
              },
            }}
            {...props}
          />
        </Flex>
      )}
    </Fade>
  );
});

export const ExpiredRequestErrorMessage = memo(props => {
  useScrollLock(true);
  return (
    <Fade in>
      {styles => (
        <Flex
          position="fixed"
          width="100%"
          height="100vh"
          zIndex={99}
          left={0}
          top={0}
          alignItems="center"
          justifyContent="center"
          p="loose"
          bg="rgba(0,0,0,0.35)"
          backdropFilter="blur(10px)"
          style={styles}
        >
          <ErrorMessage
            title="Expired request"
            body="This transaction request has expired or cannot be validated, please try to re-initiate this transaction request from the original app."
            border={'1px solid'}
            borderColor={color('border')}
            boxShadow="high"
            css={{
              '& > *': {
                pointerEvents: 'all',
              },
            }}
            {...props}
          />
        </Flex>
      )}
    </Fade>
  );
});

export const BroadcastErrorMessage = memo(props => {
  const broadcastError = useAtomValue(transactionBroadcastErrorState);
  if (!broadcastError) return null;
  return (
    <ErrorMessage
      title="There was an error when broadcasting this transaction:"
      body={broadcastError}
      {...props}
    />
  );
});
