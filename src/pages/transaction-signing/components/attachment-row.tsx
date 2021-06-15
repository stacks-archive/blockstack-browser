import React from 'react';

import { hexToHumanReadable } from '@common/utils';
import { useTransactionRequest } from '../../../common/hooks/use-transaction-request';
import { RowItem } from './row-item';

export const AttachmentRow: React.FC = () => {
  const pendingTransaction = useTransactionRequest();
  return pendingTransaction?.attachment ? (
    <RowItem name="Attachment" value={hexToHumanReadable(pendingTransaction.attachment)} />
  ) : null;
};
