import { createTxDateFormatList } from '@common/group-txs-by-date';
import { Box, Stack, Text, color } from '@stacks/ui';
import React from 'react';
import { TxItem } from './tx-item';

interface TransactionListProps {
  txsByDate: ReturnType<typeof createTxDateFormatList>;
}
export function TransactionList({ txsByDate }: TransactionListProps) {
  return (
    <Stack pb="extra-loose" spacing="extra-loose">
      {txsByDate.map(({ date, displayDate, txs }) => (
        <Box key={date}>
          <Text textStyle="body.small" color={color('text-caption')}>
            {displayDate}
          </Text>
          <Stack mt="base-loose" spacing="loose">
            {txs.map(tx => (
              <TxItem transaction={tx} key={tx.tx_id} />
            ))}
          </Stack>
        </Box>
      ))}
    </Stack>
  );
}
