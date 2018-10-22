import * as React from 'react'
import styled from 'styled-components'
import tag from 'clean-tag'
import cleanElement from 'clean-element'
import {
  space,
  width,
  fontSize,
  color,
  fontFamily,
  textAlign,
  lineHeight,
  fontWeight,
  fontStyle,
  letterSpacing,
  display,
  maxWidth,
  minWidth,
  height,
  maxHeight,
  minHeight,
  sizeWidth,
  sizeHeight,
  size,
  ratioPadding,
  ratio,
  verticalAlign,
  alignItems,
  alignContent,
  justifyItems,
  justifyContent,
  flexWrap,
  flexBasis,
  flexDirection,
  flex,
  justifySelf,
  alignSelf,
  order,
  gridGap,
  gridColumnGap,
  gridRowGap,
  gridColumn,
  gridRow,
  gridAutoFlow,
  gridAutoColumns,
  gridAutoRows,
  gridTemplateColumns,
  gridTemplateRows,
  gridTemplateAreas,
  gridArea,
  borders,
  borderColor,
  borderRadius,
  boxShadow,
  opacity,
  overflow,
  background,
  backgroundImage,
  backgroundPosition,
  backgroundRepeat,
  backgroundSize,
  position,
  zIndex,
  top,
  right,
  bottom,
  left,
  textStyle,
  buttonStyle,
  styles,
  style
} from 'styled-system'

// Custom system props

const flexGrow = style({
  prop: 'flexGrow'
})
const flexShrink = style({
  prop: 'flexShrink'
})
const cursor = style({
  prop: 'cursor'
})
const transform = style({
  prop: 'transform'
})
const transition = style({
  prop: 'transition',
  key: 'transitions'
})

// get all system props
const allPropTypes = Object.keys(styles)
  .filter((key) => typeof styles[key] === 'function')
  .reduce((a, key) => Object.assign(a, styles[key].propTypes), {})

// prevent them from being passed to dom element
const blacklist = [
  ...Object.keys(allPropTypes),
  'theme',
  'cursor',
  'transform',
  'flexGrow',
  'flexShrink',
  'transition'
]

const Base = styled(cleanElement(tag))`
  ${space};
  ${flexGrow};
  ${flexShrink};
  ${cursor};
  ${transform};
  ${transition};
  ${width};
  ${fontSize};
  ${color};
  ${fontFamily};
  ${textAlign};
  ${lineHeight};
  ${fontWeight};
  ${fontStyle};
  ${letterSpacing};
  ${display};
  ${maxWidth};
  ${minWidth};
  ${height};
  ${maxHeight};
  ${minHeight};
  ${sizeWidth};
  ${sizeHeight};
  ${size};
  ${ratioPadding};
  ${ratio};
  ${verticalAlign};
  ${alignItems};
  ${alignContent};
  ${justifyItems};
  ${justifyContent};
  ${flexWrap};
  ${flexBasis};
  ${flexDirection};
  ${flex};
  ${justifySelf};
  ${alignSelf};
  ${order};
  ${gridGap};
  ${gridColumnGap};
  ${gridRowGap};
  ${gridColumn};
  ${gridRow};
  ${gridAutoFlow};
  ${gridAutoColumns};
  ${gridAutoRows};
  ${gridTemplateColumns};
  ${gridTemplateRows};
  ${gridTemplateAreas};
  ${gridArea};
  ${borders};
  ${borderColor};
  ${borderRadius};
  ${boxShadow};
  ${opacity};
  ${overflow};
  ${background};
  ${backgroundImage};
  ${backgroundPosition};
  ${backgroundRepeat};
  ${backgroundSize};
  ${position};
  ${zIndex};
  ${top};
  ${right};
  ${bottom};
  ${left};
  ${textStyle};
  ${buttonStyle};
`

const Box = (props) => <Base blacklist={blacklist} {...props} />
const Flex = (props) => <Base display="flex" blacklist={blacklist} {...props} />
const Grid = (props) => <Base display="grid" blacklist={blacklist} {...props} />
const Inline = (props) => (
  <Base is="span" display="inline-block" blacklist={blacklist} {...props} />
)

Box.displayName = 'Box'
Flex.displayName = 'Flex'
Grid.displayName = 'Grid'
Inline.displayName = 'Inline'

export { Box, Flex, Inline, Grid }
