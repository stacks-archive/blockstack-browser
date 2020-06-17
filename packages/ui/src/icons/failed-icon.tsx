import * as React from 'react';
import { Svg } from '../svg';
import { BoxProps } from '../box';

export const FailedIcon: React.FC<BoxProps> = ({ size = 64, ...props }) => (
  <Svg width={size} height={size} viewBox="0 0 64 64" fill="none" {...props}>
    <circle cx="32" cy="32" r="30" stroke="#D4001A" strokeWidth="4" strokeLinecap="round" />
    <path
      d="M23 41L40.9995 23"
      stroke="#D4001A"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M41 41L23.0005 23"
      stroke="#D4001A"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
