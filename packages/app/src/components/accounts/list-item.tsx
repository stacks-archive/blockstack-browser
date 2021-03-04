import React from 'react';
import { useHover } from 'use-events';
import { Flex, color } from '@stacks/ui';
import { transition } from '@common/constants';

export const ListItem = ({ iconComponent, isFirst, hasAction, children, ...rest }: any) => {
  // TODO: remove this useHover, it's p bad for performance I've learned
  const [hover, bind] = useHover();
  return (
    <Flex
      py="base"
      borderBottom="1px solid"
      borderTop={isFirst ? '1px solid' : undefined}
      borderColor={color('border')}
      alignItems="center"
      cursor={hasAction ? 'pointer' : 'unset'}
      bg={hover && hasAction ? 'ink.100' : 'white'}
      transition={transition}
      px="loose"
      {...bind}
      {...rest}
    >
      {iconComponent && iconComponent({ hover })}
      {children}
    </Flex>
  );
};
