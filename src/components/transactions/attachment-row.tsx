import { useTxState } from '@common/hooks/use-tx-state';
import React from 'react';
import { RowItem } from '@components/transactions/row-item';
import { hexToHumanReadable } from '@common/utils';

export const AttachmentRow: React.FC = () => {
  const { pendingTransaction } = useTxState();
  return pendingTransaction?.attachment ? (
    <RowItem name="Attachment" value={hexToHumanReadable(pendingTransaction.attachment)} />
  ) : null;
};
