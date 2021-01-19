import { useTxState } from '@common/hooks/use-tx-state';
import { LoadingRectangle } from '@components/loading-rectangle';
import { Flex, Box, Text } from '@stacks/ui';
import React from 'react';

export const NonceRow: React.FC = () => {
  const { signedTransaction } = useTxState();
  return (
    <Flex my="base">
      <Box flexGrow={1}>
        <Text display="block" fontSize={1}>
          nonce
        </Text>
        <Text textStyle="caption" color="ink.600" fontSize={0}>
          uint
        </Text>
      </Box>
      <Box>
        {signedTransaction.value ? (
          <Text fontSize={1} color="ink.600">
            {signedTransaction.value.auth.spendingCondition?.nonce.toNumber()}
          </Text>
        ) : (
          <LoadingRectangle height="14px" width="40px" />
        )}
      </Box>
    </Flex>
  );
};
