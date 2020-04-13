import * as React from 'react';
import { Svg } from '../svg';
import { BoxProps } from '../box';

type Direction = 'up' | 'down' | 'left' | 'right';

interface ChevronProps extends BoxProps {
  direction?: Direction;
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

export const ChevronIcon: React.FC<ChevronProps> = ({
  direction,
  size = '16px',
  style = {},
  ...props
}) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    style={{ ...style, transform: `rotate(${rotate(direction)}deg)` }}
    {...props}
  >
    <path
      fill={props.color || 'currentColor'}
      d="M4.7 7.367l3.3 3.3 3.3-3.3-.943-.943L8 8.78 5.643 6.424l-.943.943z"
    />
  </Svg>
);
