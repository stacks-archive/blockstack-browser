import React from 'react';
import { Box, BoxProps } from '@stacks/ui';
import { keyframes } from '@emotion/react';

export const LoadingRectangle: React.FC<BoxProps> = props => {
  const shine = keyframes`
    0% {
      background-position: -50px;
    }
    100% {
      background-position: 500px;
    }
  `;
  return (
    <Box
      backgroundImage="linear-gradient(90deg, rgba(219,219,219,1) 0%, rgba(192,192,247,0.5) 35%, rgba(219,219,219,1) 100%)"
      backgroundColor="rgb(219,219,219)"
      animation={`${shine} 1.6s infinite linear`}
      {...props}
    />
  );
};
