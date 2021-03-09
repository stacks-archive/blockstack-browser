import React from 'react';
import { Box, Flex, Text } from '@blockstack/ui';
import { ContractCallTransaction } from '@blockstack/stacks-blockchain-sidecar-types';
import { toRelativeTime } from '@common/utils';

interface TxCardProps {
  tx: ContractCallTransaction;
  label: string;
}
export const TxCard: React.FC<TxCardProps> = ({ tx, label }) => {
  const addr = tx.sender_address;
  const shortAddr = `${addr.slice(0, 5)}...${addr.slice(addr.length - 6, addr.length - 1)}`;
  return (
    <Box
      flex="0 1 280px"
      mr="10px"
      mt={3}
      borderColor="#F0F0F5"
      borderWidth="1px"
      borderRadius="12px"
      p={6}
      _hover={{
        borderColor: 'ink.400',
        cursor: 'pointer',
      }}
      onClick={() => {
        const url = `https://testnet-explorer.blockstack.org/txid/${tx.tx_id}`;
        window.open(url, '_blank');
      }}
    >
      <Flex>
        <Box>
          <Text color="ink.600">{shortAddr}</Text>
        </Box>
        <Box flexGrow={1} textAlign="right">
          <Text color="ink.600">{toRelativeTime(tx.burn_block_time * 1000)}</Text>
        </Box>
      </Flex>
      <Text display="block" textStyle="body.large" mt={3}>
        {label}
      </Text>
    </Box>
  );
};
