import React from 'react';
import { color, Stack } from '@stacks/ui';
import { AttachmentRow } from './attachment-row';
import { RowItem } from '@components/transactions/row-item';
import { Title } from '@components/typography';
import { Divider } from '@components/divider';
import { useTransactionRequest } from '@common/hooks/transaction/use-transaction';

export const StxTransferDetails: React.FC = () => {
  const pendingTransaction = useTransactionRequest();
  if (!pendingTransaction || pendingTransaction.txType !== 'token_transfer') {
    return null;
  }
  return (
    <Stack
      spacing="loose"
      border="4px solid"
      borderColor={color('border')}
      borderRadius="12px"
      py="extra-loose"
      px="base-loose"
    >
      <Title as="h2" fontWeight="500">
        Transfer details
      </Title>
      <Stack divider={<Divider />} spacing="base">
        <RowItem name="Recipient" type="Principal" value={pendingTransaction.recipient} />
        <RowItem name="Amount" type="uSTX" value={pendingTransaction.amount} />
        {pendingTransaction.memo && (
          <RowItem name="Memo" type="string" value={pendingTransaction.memo} />
        )}
        {pendingTransaction.attachment && <AttachmentRow />}
      </Stack>
    </Stack>
  );
};
