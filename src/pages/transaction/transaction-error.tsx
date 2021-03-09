import React from 'react';
import { PopupContainer } from '@components/popup/container';
import { Box, Text, Button } from '@stacks/ui';
import { useTxState } from '@common/hooks/use-tx-state';
import { STXTransferPayload } from '@stacks/connect';
import { stacksValue } from '@common/stacks-utils';
import { useFetchBalances } from '@common/hooks/use-account-info';
import { LoadingRectangle } from '@components/loading-rectangle';
import { useWallet } from '@common/hooks/use-wallet';

export enum TransactionErrorReason {
  StxTransferInsufficientFunds = 0,
  FeeInsufficientFunds = 1,
  Generic = 2,
  BroadcastError = 3,
}

interface TransactionErrorProps {
  reason: TransactionErrorReason;
}
export const TransactionError: React.FC<TransactionErrorProps> = ({ reason }) => {
  const { pendingTransaction, broadcastError } = useTxState();
  const { currentAccountDisplayName, currentAccountStxAddress, currentNetwork } = useWallet();
  const balances = useFetchBalances();

  return (
    <PopupContainer title="Unable to sign transaction.">
      <Box mt="loose" />
      {reason === TransactionErrorReason.StxTransferInsufficientFunds ? (
        <Box>
          <Text display="block" fontSize={2}>
            You don't have enough STX to make this transfer. Try switching accounts, switching
            networks, or adding STX to this account.
          </Text>
          <Box my="base">
            <Text fontSize={2} fontWeight="500">
              Transfer amount:
            </Text>
            <Text fontSize={2} ml="tight" fontFamily="mono">
              {stacksValue({
                value: (pendingTransaction as STXTransferPayload).amount,
                withTicker: true,
              })}
            </Text>
          </Box>
          <Box my="base">
            <Text fontSize={2} fontWeight="500">
              Current balance:
            </Text>
            {balances.state === 'hasValue' ? (
              <Text fontSize={2} ml="tight" fontFamily="mono">
                {stacksValue({ value: balances.contents.stx.balance, withTicker: true })}
              </Text>
            ) : (
              <LoadingRectangle height="16px" width="50px" />
            )}
          </Box>
        </Box>
      ) : null}
      {reason === TransactionErrorReason.BroadcastError ? (
        <Box>
          <Text display="block" fontSize={2}>
            There was an error when broadcasting this transaction:
          </Text>
          <Box my="base">
            <Text fontSize={2} fontFamily="mono">
              {broadcastError}
            </Text>
          </Box>
        </Box>
      ) : null}
      <Box mb="base">
        <Text fontSize={2} fontWeight="500">
          Current Network:
        </Text>
        <Text fontSize={2} ml="tight" fontFamily="mono">
          {currentNetwork.name}
        </Text>
      </Box>
      <Box width="100%">
        {/* <Text fontSize={1} fontWeight="500">
          Current account:
        </Text> */}
        <Text fontSize={2} fontWeight="600" fontFamily="heading" color="ink.1000" display="block">
          {currentAccountDisplayName}
        </Text>
        <Text textStyle="body.small" color="ink.600">
          {currentAccountStxAddress}
        </Text>
      </Box>
      <Box flexGrow={1} />
      <Box mt="extra-loose" mb="base">
        <Button width="100%" onClick={() => window.close()}>
          Close
        </Button>
      </Box>
    </PopupContainer>
  );
};
