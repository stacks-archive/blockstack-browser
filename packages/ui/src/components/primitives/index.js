import * as React from 'react'
import styled from 'styled-components'
import tag from '../clean-tag'
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
const textTransform = style({
  prop: 'textTransform'
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
  'textTransform',
  'transition',
  'zIndex',
  'suppressClassNameWarning',
  'Type',
  'staticContext'
]

const Base = styled(tag)`
  ${space};
  ${flexGrow};
  ${flexShrink};
  ${cursor};
  ${textTransform};
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

Base.defaultProps = {
  suppressClassNameWarning: true,
  blacklist
}

const Box = (props) => <Base {...props} />
const Flex = (props) => <Base {...props} />
const Grid = (props) => <Base {...props} />
const Inline = (props) => <Base {...props} />

Box.defaultProps = {
  suppressClassNameWarning: true,
  blacklist
}
Flex.defaultProps = {
  suppressClassNameWarning: true,
  blacklist,
  display: 'flex'
}
Grid.defaultProps = {
  suppressClassNameWarning: true,
  blacklist,
  display: 'flex'
}
Inline.defaultProps = {
  suppressClassNameWarning: true,
  blacklist,
  display: 'inline-block',
  is: 'span'
}

Box.displayName = 'Box'
Flex.displayName = 'Flex'
Grid.displayName = 'Grid'
Inline.displayName = 'Inline'

export { Base, Box, Flex, Inline, Grid, blacklist }
