import { Box, Flex } from '@blockstack/ui';
import { Text } from '@components/typography';
import React from 'react';
import { Pagination } from './pagination';
import { Link } from '@components//mdx';

const Footer = ({ hidePagination, ...rest }: any) => {
  return (
    <>
      {!hidePagination && <Pagination />}
      {/*<Flex*/}
      {/*  borderTop="1px solid"*/}
      {/*  borderColor="var(--colors-border)"*/}
      {/*  textStyle="body.small.medium"*/}
      {/*  color="ink.400"*/}
      {/*  p="base"*/}
      {/*  {...rest}*/}
      {/*>*/}
      {/*  <Box>*/}
      {/*    <Text>Blockstack Design System</Text>*/}
      {/*  </Box>*/}
      {/*  <Box ml="auto">*/}
      {/*    <Link as="a" href="https://blockstack.org">*/}
      {/*      Blockstack PBC*/}
      {/*    </Link>*/}
      {/*  </Box>*/}
      {/*</Flex>*/}
    </>
  );
};

export { Footer };
