import React from 'react';
import { useTxState } from '@common/hooks/use-tx-state';
import { Box, Text, Flex } from '@stacks/ui';
import { NonceRow } from './nonce-row';

export const StxTransferDetails: React.FC = () => {
  const { pendingTransaction } = useTxState();
  if (!pendingTransaction || pendingTransaction.txType !== 'token_transfer') {
    return null;
  }
  return (
    <>
      <Box mt="base">
        <Text fontWeight="500" display="block" fontSize={2}>
          Stacks Transfer Details
        </Text>
      </Box>
      <Box>
        <Flex flexDirection="column" flexWrap="wrap" width="100%">
          <Box mt="base" width="100%">
            <Flex my="base">
              <Box flexGrow={1}>
                <Text display="block" fontSize={1}>
                  Recipient
                </Text>
                <Text textStyle="caption" color="ink.600" fontSize={0}>
                  principal
                </Text>
              </Box>
              <Box>
                <Text fontSize={0} color="ink.600" title={pendingTransaction.recipient} mt="2px">
                  {pendingTransaction.recipient}
                </Text>
              </Box>
            </Flex>
            {pendingTransaction.memo && (
              <Flex my="base">
                <Box flexGrow={1}>
                  <Text display="block" fontSize={1}>
                    Memo
                  </Text>
                  <Text textStyle="caption" color="ink.600" fontSize={0}>
                    string
                  </Text>
                </Box>
                <Box>
                  <Text fontSize={1} color="ink.600" title={pendingTransaction.memo}>
                    {pendingTransaction.memo}
                  </Text>
                </Box>
              </Flex>
            )}
            <NonceRow />
          </Box>
        </Flex>
      </Box>
    </>
  );
};
