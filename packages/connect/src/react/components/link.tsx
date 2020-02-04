import React from 'react';
import { Text, Box } from '@blockstack/ui';
import { BoxProps } from '@blockstack/ui/dist/box/types';

interface LinkProps extends BoxProps {
  _hover?: BoxProps;
}

export const Link: React.FC<LinkProps> = ({ _hover = {}, children, ...rest }) => (
  <Box {...rest}>
    <Text _hover={{ textDecoration: 'underline', cursor: 'pointer', ..._hover }} textStyle="caption.medium">
      {children}
    </Text>
  </Box>
);
