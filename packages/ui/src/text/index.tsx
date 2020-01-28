import React, { forwardRef } from 'react';
import { PseudoBox, PseudoBoxProps } from '../pseudo-box';

// if nothing is passed for the prop `textStyle`, we will assume styles for various dom elements
const assumeTextStyle = (as: string | React.ElementType) => {
  switch (as) {
    case 'h1':
      return 'display.large';
    case 'h2':
      return 'display.small';
    case 'h3':
      return 'body.large.medium';
    default:
      return undefined;
  }
};
const Text = forwardRef<any, PseudoBoxProps>(({ textStyle, as = 'span', ...rest }, ref) => {
  return (
    <PseudoBox
      ref={ref}
      as={as}
      whiteSpace="unset"
      display="inline"
      textStyle={textStyle || assumeTextStyle(as)}
      {...rest}
    />
  );
});

export { Text };
