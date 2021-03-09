import React from 'react';
import { Flex, Box } from '@stacks/ui';
import { BlockstackMini } from '../vector';
import { buildEnterKeyEvent } from '../link';

const onClick = () => {
  typeof window !== 'undefined' && window.open('https://blockstack.org', '_blank');
};

export const PoweredBy: React.FC = () => (
  <Flex
    fontSize={['12px', '14px']}
    justifyContent="center"
    color="ink.600"
    textAlign="center"
    width="100%"
    my="loose"
  >
    <Box
      textAlign="center"
      onClick={onClick}
      onKeyPress={buildEnterKeyEvent(onClick)}
      textStyle="caption"
      display="flex"
      alignSelf="flex-end"
      tabIndex={0}
      _hover={{
        cursor: 'pointer',
      }}
    >
      Powered by
      <Box ml="2px">
        <BlockstackMini />
      </Box>
      Blockstack
    </Box>
  </Flex>
);
