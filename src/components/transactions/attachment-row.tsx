import { useTxState } from '@common/hooks/use-tx-state';
import { Flex, Box, Text } from '@stacks/ui';
import React from 'react';

function readable(data: string) {
  const text = Buffer.from(data, 'hex').toString('ascii');
  return /^[^\x00-\x1F\x80-\x9F]+$/.test(text) ? text : `0x${data}`;
}

export const AttachentRow: React.FC = () => {
  const { pendingTransaction } = useTxState();
  return pendingTransaction?.attachment ? (
    <Flex my="base">
      <Box flexGrow={1}>
        <Text display="block" fontSize={1}>
          attachment
        </Text>
      </Box>
      <Box>
        <Text fontSize={1} color="ink.600">
          {readable(pendingTransaction.attachment)}
        </Text>
      </Box>
    </Flex>
  ) : null;
};
