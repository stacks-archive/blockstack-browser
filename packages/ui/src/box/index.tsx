import React, { forwardRef, Ref } from 'react';
import shouldForwardProp from '@styled-system/should-forward-prop';
import styled from 'styled-components';

import {
  background,
  border,
  color,
  flexbox,
  grid,
  layout,
  position,
  shadow,
  space,
  typography,
  textStyle,
  colorStyle,
  buttonStyle,
  compose,
} from 'styled-system';

import extraConfig from './config';
import { BoxProps } from './types';

export * from './types';

export const systemProps = compose(
  layout,
  color,
  space,
  background,
  border,
  grid,
  position,
  shadow,
  typography,
  flexbox,
  textStyle,
  buttonStyle,
  colorStyle
);

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
export const StyledBox = styled('div').withConfig({
  shouldForwardProp,
})<BoxProps>`
  ${systemProps};
  ${extraConfig};
`;

const Box = forwardRef((props: BoxProps, ref: Ref<HTMLDivElement>) => (
  <StyledBox ref={ref} {...props} />
));

Box.displayName = 'Box';

export { Box };
