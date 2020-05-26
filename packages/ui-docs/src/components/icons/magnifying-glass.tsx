import React from 'react';

import { Box, BoxProps } from '@blockstack/ui';

interface MagnifyingGlassProps extends BoxProps {
  size?: number;
}

export const MagnifyingGlass = ({ size = 16, ...props }: MagnifyingGlassProps) => (
  <Box position="relative" display="inline-block" {...props}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill="none"
      viewBox="0 0 16 16"
    >
      <path
        fill="#A1A7B3"
        d="M4.818 9.765L2.28 12.303a1.001 1.001 0 001.416 1.416l2.538-2.538A5.005 5.005 0 104.82 9.766l-.001-.001zm4.176.243a3.003 3.003 0 110-6.007 3.003 3.003 0 010 6.007z"
      />
    </svg>
  </Box>
);
