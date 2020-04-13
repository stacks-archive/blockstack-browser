import * as React from 'react';
import { Svg } from '../svg';
import { BoxProps } from '../box';

export const CheckmarkIcon: React.FC<BoxProps> = ({
  size = 72,
  color = 'currentColor',
  ...props
}) => (
  <Svg width={size} height={size} fill="none" viewBox="0 0 72 72" {...props}>
    <circle cx="36" cy="36" r="34.5" fill="#fff" stroke={color} strokeWidth="3" />
    <path
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="3"
      d="M21 37l10 10 20-22"
    />
  </Svg>
);
