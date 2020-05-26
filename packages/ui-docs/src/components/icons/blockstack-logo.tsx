import React from 'react';
import { Box, BoxProps } from '@blockstack/ui';

export const BlockstackLogo = ({ size = '24px', ...props }: BoxProps) => (
  <Box width={size} height={size} color="var(--colors-invert)" {...props}>
    <svg fill="none" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M.296 2.17C0 2.854 0 3.727 0 5.472v13.056c0 1.745 0 2.617.296 3.302a3.6 3.6 0 001.874 1.874C2.854 24 3.727 24 5.472 24h13.056c1.745 0 2.617 0 3.302-.296a3.6 3.6 0 001.874-1.874c.296-.684.296-1.557.296-3.302V5.472c0-1.745 0-2.618-.296-3.302A3.6 3.6 0 0021.83.296C21.146 0 20.273 0 18.528 0H5.472C3.727 0 2.812 0 2.17.296A3.6 3.6 0 00.296 2.17zm15.535 8.17a2.169 2.169 0 110-4.339 2.169 2.169 0 010 4.338zm-5.495-2.17A2.168 2.168 0 116 8.17a2.168 2.168 0 014.336 0zm5.495 5.5a2.169 2.169 0 100 4.337 2.169 2.169 0 000-4.338zm-7.663.001a2.168 2.168 0 110 4.336 2.168 2.168 0 010-4.336z"
        clipRule="evenodd"
      />
    </svg>
  </Box>
);
