import React from 'react';
import { Text, Box, BoxProps } from '@blockstack/ui';

interface LinkProps extends BoxProps {
  _hover?: BoxProps;
}

const Link: React.FC<LinkProps> = ({ _hover = {}, children, ...rest }) => (
  <Box {...rest}>
    <Text color="blue" _hover={{ textDecoration: 'underline', cursor: 'pointer', ..._hover }} fontWeight="medium">
      {children}
    </Text>
  </Box>
);

export { Link };
