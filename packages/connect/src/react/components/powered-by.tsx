import React from 'react';
import { Flex } from '@blockstack/ui';
import { BlockstackMini } from './vector';
import { Link } from './link';

export const PoweredBy: React.FC = () => (
  <Flex
    fontSize={['12px', '14px']}
    justifyContent="center"
    color="ink.600"
    fontWeight="medium"
    textAlign="center"
    width="100%"
    my={6}
  >
    <Link
      mx="auto"
      textAlign="center"
      onClick={() => window.open('https://blockstack.org', '_blank')}
      textStyle="caption"
      alignSelf="flex-end"
      _hover={{ textDecoration: 'none' }}
    >
      Powered by
      <BlockstackMini />
      Blockstack
    </Link>
  </Flex>
);
