import React from 'react';

import { hexToHumanReadable } from '@common/utils';
import { useTransactionRequest } from '../hooks/use-transaction';
import { RowItem } from './row-item';

export const AttachmentRow: React.FC = () => {
  const pendingTransaction = useTransactionRequest();
  return pendingTransaction?.attachment ? (
    <RowItem name="Attachment" value={hexToHumanReadable(pendingTransaction.attachment)} />
  ) : null;
};
