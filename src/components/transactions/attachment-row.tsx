import { useTxState } from '@common/hooks/use-tx-state';
import { Flex, Box, Text } from '@stacks/ui';
import { isUtf8 } from '@common/utils';
import React from 'react';

function toHumanReadable(hex: string) {
  const buff = Buffer.from(hex, 'hex');
  if (isUtf8(buff)) return buff.toString('utf8');
  return `0x${hex}`;
}

export const AttachmentRow: React.FC = () => {
  const { pendingTransaction } = useTxState();
  return pendingTransaction?.attachment ? (
    <Flex my="base">
      <Box as={Text} flexGrow={1} display="block" fontSize={1}>
        attachment
      </Box>
      <Box wordBreak="break-word" as={Text} fontSize={1} color="ink.600">
        {toHumanReadable(pendingTransaction.attachment)}
      </Box>
    </Flex>
  ) : null;
};
