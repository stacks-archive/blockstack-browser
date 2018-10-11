import * as React from 'react'
import styled from 'styled-components'
import tag from 'clean-tag'
import cleanElement from 'clean-element'
import PropTypes from 'prop-types'
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
  buttonStyle
} from 'styled-system'

const Box = styled(cleanElement(tag))`
  ${space};
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
const Flex = (props) => <Box display="flex" {...props} />

const Inline = (props) => <Box is="span" {...props} />

const boxPropTypes = PropTypes.oneOfType([
  PropTypes.number,
  PropTypes.string,
  PropTypes.array
])

Box.propTypes = {
  width: boxPropTypes,
  p: boxPropTypes,
  py: boxPropTypes,
  px: boxPropTypes,
  pt: boxPropTypes,
  pb: boxPropTypes,
  pl: boxPropTypes,
  pr: boxPropTypes,
  m: boxPropTypes,
  my: boxPropTypes,
  mx: boxPropTypes,
  mt: boxPropTypes,
  mb: boxPropTypes,
  ml: boxPropTypes,
  mr: boxPropTypes,
  fontSize: boxPropTypes,
  color: boxPropTypes,
  flex: boxPropTypes,
  order: boxPropTypes,
  alignSelf: boxPropTypes,
  opacity: boxPropTypes,
  display: boxPropTypes,
  position: boxPropTypes,
  top: boxPropTypes,
  right: boxPropTypes,
  left: boxPropTypes,
  bottom: boxPropTypes,
  minHeight: boxPropTypes,
  borderRadius: boxPropTypes,
  maxHeight: boxPropTypes,
  maxWidth: boxPropTypes,
  minWidth: boxPropTypes,
  borders: boxPropTypes
}

Flex.propTypes = {
  width: boxPropTypes,
  p: boxPropTypes,
  py: boxPropTypes,
  px: boxPropTypes,
  pt: boxPropTypes,
  pb: boxPropTypes,
  pl: boxPropTypes,
  pr: boxPropTypes,
  m: boxPropTypes,
  my: boxPropTypes,
  mx: boxPropTypes,
  mt: boxPropTypes,
  mb: boxPropTypes,
  ml: boxPropTypes,
  mr: boxPropTypes,
  fontSize: boxPropTypes,
  color: boxPropTypes,
  flex: boxPropTypes,
  order: boxPropTypes,
  alignSelf: boxPropTypes,
  opacity: boxPropTypes,
  display: boxPropTypes,
  position: boxPropTypes,
  top: boxPropTypes,
  right: boxPropTypes,
  left: boxPropTypes,
  bottom: boxPropTypes,
  minHeight: boxPropTypes,
  borderRadius: boxPropTypes,
  maxHeight: boxPropTypes,
  maxWidth: boxPropTypes,
  minWidth: boxPropTypes,
  borders: boxPropTypes,
  justifyContent: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  flexWrap: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  alignItems: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  flexDirection: PropTypes.oneOfType([PropTypes.string, PropTypes.array])
}

Inline.defaultProps = {
  display: 'inline-block'
}

Box.displayName = 'Box'
Flex.displayName = 'Flex'
Inline.displayName = 'Inline'

export const StyledSystem = {
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
  buttonStyle
}

export { Box, Flex, Inline }
