import React from 'react';

import { Box, BoxProps } from '@stacks/ui';

export const Logo: React.FC<BoxProps> = ({ ...props }) => (
  <Box {...props}>
    <img src="/assets/images/logo-data-vault.svg" alt="Secret Key logo" />
  </Box>
);
