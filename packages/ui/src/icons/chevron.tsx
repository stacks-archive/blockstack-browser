import React from 'react';
import { Box, BoxProps } from '../box';

type Direction = 'up' | 'down' | 'left' | 'right';

interface ChevronProps extends BoxProps {
  direction: Direction;
  size: number;
}

const rotate = (direction: Direction = 'right') => {
  switch (direction) {
    case 'left':
      return '90';
    case 'up':
      return '180';
    case 'right':
      return '270';
    case 'down':
      return 0;
    default:
      throw new Error('`rotate` must receive direction parameter');
  }
};

export const ChevronIcon = ({ direction, size = 16, ...props }: ChevronProps) => (
  <Box {...props}>
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" transform={`rotate(${rotate(direction)})`}>
      <path fill="#C1C3CC" d="M4.7 7.367l3.3 3.3 3.3-3.3-.943-.943L8 8.78 5.643 6.424l-.943.943z"></path>
    </svg>
  </Box>
);
