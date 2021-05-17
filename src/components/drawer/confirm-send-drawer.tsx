import React, { useCallback, useState } from 'react';
import { Button, color, Flex, Stack, StackProps } from '@stacks/ui';
import { Caption } from '@components/typography';
import { BaseDrawer, BaseDrawerProps } from './index';
import { StacksTransaction } from '@stacks/transactions';
import { stacksValue } from '@common/stacks-utils';
import { useHandleSubmitTransaction } from '@common/hooks/use-submit-stx-transaction';
import { truncateMiddle } from '@stacks/ui-utils';
import { useLoading } from '@common/hooks/use-loading';

import { useMakeTransferEffect } from '@common/hooks/use-make-stx-transfer';
import { useSelectedAsset } from '@common/hooks/use-selected-asset';
import { TransactionEventCard } from '@components/transactions/event-card';
import { useCurrentAccount } from '@common/hooks/use-current-account';
import { SpaceBetween } from '@components/space-between';
import { NetworkRowItem } from '@components/network-row-item';

interface ConfirmSendDrawerProps extends BaseDrawerProps {
  amount: number;
  recipient: string;
}

const LOADING_KEY = 'confirm-send-drawer';

const TransactionDetails: React.FC<
  {
    amount: number;
    nonce?: number;
    fee?: number;
    recipient: string;
  } & StackProps
> = ({ amount, nonce, fee, recipient, ...rest }) => {
  const { ticker } = useSelectedAsset();
  const { stxAddress } = useCurrentAccount();
  const { selectedAsset } = useSelectedAsset();
  return (
    <Flex
      border="4px solid"
      borderColor={color('border')}
      borderRadius="12px"
      width="100%"
      flexDirection="column"
      {...rest}
    >
      <TransactionEventCard
        amount={amount}
        icon={
          selectedAsset?.contractAddress
            ? selectedAsset.contractAddress + '.' + selectedAsset.contractName
            : 'STX'
        }
        ticker={ticker || 'STX'}
        title="You will transfer extactly"
        left={stxAddress ? `From ${truncateMiddle(stxAddress)}` : undefined}
        right={`To ${truncateMiddle(recipient)}`}
      />
    </Flex>
  );
};

const Actions: React.FC<{ transaction: StacksTransaction | null; handleCancel: () => void }> = ({
  transaction,
  handleCancel,
}) => {
  const { isLoading } = useLoading(LOADING_KEY);
  const handleSubmit = useHandleSubmitTransaction({
    transaction,
    onClose: handleCancel,
    loadingKey: LOADING_KEY,
  });
  return (
    <Stack spacing="base" width="100%">
      <Button
        borderRadius="12px"
        mode="primary"
        isDisabled={!transaction || isLoading}
        onClick={() => {
          void handleSubmit();
        }}
        isLoading={!transaction || isLoading}
      >
        Send
      </Button>
    </Stack>
  );
};

export const ConfirmSendDrawer: React.FC<Omit<ConfirmSendDrawerProps, 'title'>> = ({
  isShowing,
  onClose,
  amount,
  recipient,
}) => {
  const [transaction, setTransaction] = useState<StacksTransaction | null>(null);

  useMakeTransferEffect({
    transaction,
    setTransaction,
    isShowing,
    amount,
    recipient,
    loadingKey: LOADING_KEY,
  });

  const handleCancel = useCallback(() => {
    setTransaction(null);
    onClose();
  }, [setTransaction, onClose]);

  const fee = transaction?.auth.spendingCondition?.fee?.toNumber();

  return (
    <BaseDrawer title="Confirm transfer" isShowing={isShowing} onClose={handleCancel}>
      <Stack pb="extra-loose" px="loose" spacing="extra-loose">
        <TransactionDetails
          amount={amount}
          recipient={recipient}
          nonce={transaction?.auth.spendingCondition?.nonce.toNumber()}
          fee={transaction?.auth.spendingCondition?.fee?.toNumber()}
        />
        <Stack spacing="base">
          <SpaceBetween>
            <Caption>Fees</Caption>
            <Caption>
              {(fee && stacksValue({ value: fee, fixedDecimals: true, withTicker: true })) || '--'}
            </Caption>
          </SpaceBetween>
          <SpaceBetween>
            <Caption>Network</Caption>
            <NetworkRowItem />
          </SpaceBetween>
        </Stack>
        <Actions transaction={transaction} handleCancel={handleCancel} />
      </Stack>
    </BaseDrawer>
  );
};
