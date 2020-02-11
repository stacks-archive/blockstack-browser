import React from 'react';
import { Text, Box, BoxProps } from '@blockstack/ui';

interface LinkProps extends BoxProps {
  _hover?: BoxProps;
}

export const Link: React.FC<LinkProps> = ({ _hover = {}, children, fontSize = '14px', ...rest }) => (
  <Box {...rest}>
    <Text
      _hover={{ textDecoration: 'underline', cursor: 'pointer', ..._hover }}
      fontSize={fontSize}
      fontWeight="medium"
    >
      {children}
    </Text>
  </Box>
);
