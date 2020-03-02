import * as React from 'react';
import { Svg } from '../svg';
import { BoxProps } from '../box';

export const ExclamationMarkIcon: React.FC<BoxProps> = props => (
  <Svg width="12" height="12" fill="none" viewBox="0 0 12 12" {...props}>
    <circle cx="6" cy="6" r="6" fill={props.color || 'currentColor'} />
    <path
      fill="#fff" // TODO: abstract out to be the background color, related to darkmode changes
      d="M6.62 3.64a.622.622 0 10-1.244 0l.083 2.983a.54.54 0 001.081 0l.08-2.984zM6 9c.368 0 .687-.31.69-.694A.7.7 0 006 7.617.69.69 0 006 9z"
    />
  </Svg>
);
