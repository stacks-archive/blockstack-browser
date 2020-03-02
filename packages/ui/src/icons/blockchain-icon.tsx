import * as React from 'react';
import { Svg } from '../svg';
import { BoxProps } from '../box';

export const BlockchainIcon: React.FC<BoxProps> = props => {
  const color = props.color || 'currentColor';

  return (
    <Svg {...props}>
      <rect width="12" height="12" rx="2.25" fill={color} />
      <rect opacity="0.6" x="12" y="12" width="12" height="12" rx="2.25" fill={color} />
      <rect
        opacity="0.4"
        x="14.75"
        y="2.75"
        width="6.5"
        height="6.5"
        rx="1"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <rect
        opacity="0.4"
        x="2.75"
        y="14.75"
        width="6.5"
        height="6.5"
        rx="1"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
