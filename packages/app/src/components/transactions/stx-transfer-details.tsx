import React from 'react';
import { useTxState } from '@common/hooks/use-tx-state';
import { Box, Text, Flex } from '@stacks/ui';
import { truncateMiddle } from '@stacks/ui-utils';

export const StxTransferDetails: React.FC = () => {
  const { pendingTransaction } = useTxState();
  if (!pendingTransaction || pendingTransaction.txType !== 'token_transfer') {
    return null;
  }
  return (
    <>
      <Box mt="base">
        <Text fontWeight="500" display="block">
          Stacks Transfer Details
        </Text>
      </Box>
      <Box>
        <Flex dir="column" flexWrap="wrap" width="100%">
          <Box mt="base" width="100%">
            <Flex>
              <Box flexGrow={1}>
                <Text display="block">Recipient</Text>
                <Text textStyle="caption" color="ink.600">
                  Principal
                </Text>
              </Box>
              <Box>
                <Text fontSize={1} color="ink.600" title={pendingTransaction.recipient}>
                  {truncateMiddle(pendingTransaction.recipient)}
                </Text>
              </Box>
              {pendingTransaction.memo && (
                <>
                  <Box flexGrow={1}>
                    <Text display="block">Recipient</Text>
                    <Text textStyle="caption" color="ink.600">
                      Memo
                    </Text>
                  </Box>
                  <Box>
                    <Text fontSize={1} color="ink.600" title={pendingTransaction.memo}>
                      {truncateMiddle(pendingTransaction.memo, 10)}
                    </Text>
                  </Box>
                </>
              )}
            </Flex>
          </Box>
        </Flex>
      </Box>
    </>
  );
};
