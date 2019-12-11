import React, { forwardRef, Ref } from 'react'
import styled from 'styled-components'

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
  compose
} from 'styled-system'

import extraConfig from './config'
import { BoxProps } from './types'

export * from './types'

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
)

export const StyledBox = styled.div<BoxProps>`
  ${systemProps};
  ${extraConfig};
`

export const Box = forwardRef((props: BoxProps, ref: Ref<HTMLDivElement>) => <StyledBox ref={ref} {...props} />)
