import React from 'react';
import { Box, BoxProps, color } from '@stacks/ui';

export const Divider: React.FC<BoxProps> = props => (
  <Box width="100%" height="1px" bg={color('border')} {...props} />
);
