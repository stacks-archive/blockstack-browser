import * as React from 'react';
import { Svg } from '../svg';
import { BoxProps } from '../box';
import { Direction } from './icon-utils';

interface ArrowIconProps extends BoxProps {
  direction?: Direction;
}

const rotate = (direction: Direction = 'up') => {
  switch (direction) {
    case 'up':
      return 0;
    case 'right':
      return '90';
    case 'down':
      return '180';
    case 'left':
      return '270';
    default:
      throw new Error('`rotate` must receive direction parameter');
  }
};

export const ArrowIcon: React.FC<ArrowIconProps> = ({ direction, style, ...props }) => (
  <Svg
    width="11px"
    height="14px"
    viewBox="0 0 11 14"
    style={{ ...style, transform: `rotate(${rotate(direction)}deg)` }}
    {...props}
  >
    <path
      d="M5.5 13.559c.444 0 .759-.315.759-.766V4.351l-.055-1.477 1.77 1.976 1.56 1.545a.765.765 0 00.54.225c.416 0 .73-.314.73-.745a.754.754 0 00-.239-.547L6.061.816a.78.78 0 00-1.128 0L.435 5.328a.754.754 0 00-.24.547c0 .43.308.745.725.745.219 0 .41-.089.547-.225L3.019 4.85l1.777-1.983-.062 1.484v8.442c0 .451.315.766.766.766z"
      fill="currentColor"
    />
  </Svg>
);
