import React, { useCallback, useState } from 'react';
import { Button, Stack, StackProps } from '@stacks/ui';
import { Caption, Text } from '@components/typography';
import { Tooltip } from '@components/tooltip';
import { BaseDrawer, BaseDrawerProps } from './index';
import { StacksTransaction } from '@stacks/transactions';
import { stacksValue } from '@common/stacks-utils';
import { useHandleSubmitTransaction } from '@common/hooks/use-submit-stx-transaction';
import { LoadingRectangle } from '@components/loading-rectangle';
import { truncateMiddle } from '@stacks/ui-utils';
import { useLoading } from '@common/hooks/use-loading';

import { useMakeTransferEffect } from '@common/hooks/use-make-stx-transfer';
import { useRecoilValue } from 'recoil';
import { selectedAssetStore } from '@store/recoil/asset-search';
import { getTicker } from '@common/utils';

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
  const asset = useRecoilValue(selectedAssetStore);
  const ticker = asset && asset.type !== 'stx' ? getTicker(asset.name) : 'STX';
  return (
    <Stack spacing="loose" {...rest}>
      <Stack width="100%" px="extra-loose">
        <Caption>Amount</Caption>
        <Text>
          {amount} {ticker}
        </Text>
      </Stack>
      <Stack width="100%" px="extra-loose">
        <Caption>Recipient</Caption>
        <Tooltip label={recipient}>
          <Text>{truncateMiddle(recipient, 12)}</Text>
        </Tooltip>
      </Stack>
      <Stack width="100%" px="extra-loose">
        <Caption>Nonce</Caption>
        {nonce ? <Text>{nonce}</Text> : <LoadingRectangle height="14px" width="80px" />}
      </Stack>
      <Stack width="100%" px="extra-loose">
        <Caption>Fee</Caption>
        {fee ? (
          <Text>
            {stacksValue({
              value: fee || 0,
            })}
          </Text>
        ) : (
          <LoadingRectangle height="14px" width="80px" />
        )}
      </Stack>
    </Stack>
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
    <Stack spacing="base" pb="loose" width="100%" px="extra-loose">
      <Button
        mode="primary"
        isDisabled={!transaction || isLoading}
        onClick={() => {
          void handleSubmit();
        }}
        isLoading={!transaction || isLoading}
      >
        Send
      </Button>
      <Button mode="tertiary" onClick={handleCancel}>
        Cancel
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

  return (
    <BaseDrawer title="Confirm transfer" isShowing={isShowing} onClose={handleCancel}>
      <Stack pt="tight" spacing="extra-loose">
        <TransactionDetails
          amount={amount}
          recipient={recipient}
          nonce={transaction?.auth.spendingCondition?.nonce.toNumber()}
          fee={transaction?.auth.spendingCondition?.fee?.toNumber()}
        />
        <Actions transaction={transaction} handleCancel={handleCancel} />
      </Stack>
    </BaseDrawer>
  );
};
