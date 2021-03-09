import React, { memo } from 'react';
import { Box, BoxProps, color } from '@stacks/ui';
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
      <Caption borderBottom="1px solid" borderColor={color('border')} width="100%" p="tight">
        {title}
      </Caption>
      <Box p="base">{children}</Box>
    </Box>
  );
});
