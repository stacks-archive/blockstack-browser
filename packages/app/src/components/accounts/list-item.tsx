import React from 'react';
import { useHover } from 'use-events';
import { Flex, Box } from '@stacks/ui';
import { transition } from '@common/constants';

export const ListItem = ({ iconComponent, isFirst, hasAction, children, ...rest }: any) => {
  const [hover, bind] = useHover();

  return (
    <Flex
      py={3}
      borderBottom="1px solid"
      borderBottomColor="inherit"
      borderTop={isFirst ? '1px solid' : undefined}
      borderTopColor="inherit"
      alignItems="center"
      cursor={hasAction ? 'pointer' : 'unset'}
      bg={hover && hasAction ? 'ink.100' : 'white'}
      mt={isFirst ? 5 : 0}
      transition={transition}
      {...bind}
      {...rest}
    >
      {iconComponent && iconComponent({ hover })}
      <Box flex={1} overflow="hidden" textAlign="left">
        {children}
      </Box>
    </Flex>
  );
};
