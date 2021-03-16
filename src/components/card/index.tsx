import React, { memo } from 'react';
import { Box, BoxProps, color, Flex } from '@stacks/ui';
import { Caption } from '@components/typography';

interface CardProps extends BoxProps {
  title: string;
}

export const Card: React.FC<CardProps> = memo(({ title, children, ...rest }) => {
  return (
    <Box
      borderRadius="6px"
      border="1px solid"
      borderColor={color('border')}
      boxShadow="low"
      textAlign="center"
      {...rest}
    >
      <Flex
        alignItems="center"
        justifyContent="center"
        borderBottom="1px solid"
        borderColor={color('border')}
        width="100%"
        p="base-tight"
      >
        <Caption>{title}</Caption>
      </Flex>
      <Box p="base">{children}</Box>
    </Box>
  );
});
