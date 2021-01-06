import React from 'react';
import { Svg, BoxProps } from '@stacks/ui';

export const StxIcon: React.FC<BoxProps> = props => (
  <Svg width="12" height="12" viewBox="0 0 12 12" fill="none" {...props}>
    <path
      d="M8.34257 8.14106L10.8917 12H8.98741L5.99496 7.46599L3.00252 12H1.10831L3.65743 8.15113H0V6.69018H12V8.14106H8.34257Z"
      fill="white"
    />
    <path
      d="M12 3.80856V5.26952V5.2796H0V3.80856H3.5869L1.06801 0H2.97229L5.99496 4.59446L9.02771 0H10.932L8.4131 3.80856H12Z"
      fill="white"
    />
  </Svg>
);
