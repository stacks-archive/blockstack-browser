import { useTxState } from '@common/hooks/use-tx-state';
import { isUtf8 } from '@common/utils';
import React from 'react';
import { RowItem } from '@components/transactions/row-item';

function isHex(hex: string): boolean {
  const regexp = /^[0-9a-fA-F]+$/;
  return regexp.test(hex);
}

function toHumanReadable(hex: string) {
  if (!isHex(hex)) return hex;
  const buff = Buffer.from(hex, 'hex');
  if (isUtf8(buff)) return buff.toString('utf8');
  return `0x${hex}`;
}

export const AttachmentRow: React.FC = () => {
  const { pendingTransaction } = useTxState();
  return pendingTransaction?.attachment ? (
    <RowItem name="Attachment" value={toHumanReadable(pendingTransaction.attachment)} />
  ) : null;
};
