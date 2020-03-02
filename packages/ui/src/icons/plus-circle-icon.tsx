import * as React from 'react';
import { Svg } from '../svg';
import { BoxProps } from '../box';

export const PlusCircleIcon: React.FC<BoxProps> = props => (
  <Svg {...props}>
    <circle cx="12" cy="12" r="12" fill="currentColor" />
    <g clipPath="url(#clip0)">
      <path
        fill="#fff"
        fillRule="evenodd"
        d="M8.36 11.25a.75.75 0 000 1.5h3.375v3.376a.75.75 0 001.5 0V12.75h3.377a.75.75 0 000-1.5h-3.376V7.874a.75.75 0 10-1.5 0v3.376H8.358z"
        clipRule="evenodd"
      />
    </g>
    <defs>
      <clipPath id="clip0">
        <path fill="#fff" d="M4 12H16V24H4z" transform="rotate(-45 4 12)" />
      </clipPath>
    </defs>
  </Svg>
);
