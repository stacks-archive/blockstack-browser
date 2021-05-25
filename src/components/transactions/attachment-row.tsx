import React from 'react';
import { RowItem } from '@components/transactions/row-item';
import { hexToHumanReadable } from '@common/utils';
import { useTransactionRequest } from '@common/hooks/use-transaction';

export const AttachmentRow: React.FC = () => {
  const pendingTransaction = useTransactionRequest();
  return pendingTransaction?.attachment ? (
    <RowItem name="Attachment" value={hexToHumanReadable(pendingTransaction.attachment)} />
  ) : null;
};
