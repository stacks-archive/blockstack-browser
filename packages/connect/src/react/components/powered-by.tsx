import React from 'react';
import { Flex, PseudoBox, Box } from '@blockstack/ui';
import { BlockstackMini } from './vector';

export const PoweredBy: React.FC = () => (
  <Flex fontSize={['12px', '14px']} justifyContent="center" color="ink.600" textAlign="center" width="100%" my={6}>
    <PseudoBox
      textAlign="center"
      onClick={() => typeof window !== 'undefined' && window.open('https://blockstack.org', '_blank')}
      textStyle="caption"
      display="flex"
      alignSelf="flex-end"
      _hover={{
        cursor: 'pointer',
      }}
    >
      Powered by
      <Box ml="2px">
        <BlockstackMini />
      </Box>
      Blockstack
    </PseudoBox>
  </Flex>
);
