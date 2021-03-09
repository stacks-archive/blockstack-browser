import React from 'react';
import { useTxState } from '@common/hooks/use-tx-state';
import { Box, Text, Flex, CodeBlock } from '@stacks/ui';
import { truncateMiddle } from '@stacks/ui-utils';
import { useWallet } from '@common/hooks/use-wallet';
import { Prism } from '@common/clarity-prism';
import { NonceRow } from './nonce-row';

export const ContractDeployDetails: React.FC = () => {
  const { pendingTransaction } = useTxState();
  const { currentAccount, currentAccountStxAddress } = useWallet();
  if (!pendingTransaction || pendingTransaction.txType !== 'smart_contract' || !currentAccount) {
    return null;
  }
  return (
    <>
      <Box mt="base">
        <Text fontWeight="500" display="block" fontSize={2}>
          Contract Deploy Details
        </Text>
      </Box>
      <Box maxWidth="100%">
        <Flex flexDirection="column" flexWrap="wrap" width="100%">
          <Box mt="base" width="100%">
            <Flex my="base">
              <Box flexGrow={1}>
                <Text display="block" fontSize={1}>
                  Contract Address
                </Text>
                <Text textStyle="caption" color="ink.600" fontSize={0}>
                  Principal
                </Text>
              </Box>
              <Box>
                <Text fontSize={1} color="ink.600" title={currentAccountStxAddress}>
                  {truncateMiddle(currentAccountStxAddress || '')}
                </Text>
              </Box>
            </Flex>
            <Flex my="base">
              <Box flexGrow={1}>
                <Text display="block" fontSize={1}>
                  Contract Name
                </Text>
                <Text textStyle="caption" color="ink.600" fontSize={0}>
                  String
                </Text>
              </Box>
              <Box>
                <Text fontSize={1} color="ink.600" title={pendingTransaction.contractName}>
                  {pendingTransaction.contractName}
                </Text>
              </Box>
            </Flex>
            <Flex my="base" flexDirection="column">
              <Box mb="base" width="100%" fontSize={1}>
                <Text display="block">Contract Code</Text>
              </Box>
              <CodeBlock
                backgroundColor="ink.1000"
                width="100%"
                code={pendingTransaction.codeBody}
                Prism={Prism as any}
              />
            </Flex>
            <NonceRow />
          </Box>
        </Flex>
      </Box>
    </>
  );
};
