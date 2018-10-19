import React from 'react'
import styled from 'styled-components'
import { Box } from '../primitives'
import { theme } from '../../common'
import { Focus } from 'react-powerplug'
import epitath from 'epitath'

const { colors } = theme

const StyledInputWrapper = styled.div`
  input::placeholder {
    /* Chrome, Firefox, Opera, Safari 10.1+ */
    color: ${(props) =>
      props.variant === 'marketing'
        ? colors.blue.neutral
        : colors.blue.mid} !important;
    opacity: 1; /* Firefox */
  }

  input:-ms-input-placeholder {
    /* Internet Explorer 10-11 */
    color: ${(props) =>
      props.variant === 'marketing'
        ? colors.blue.neutral
        : colors.blue.mid} !important;
  }

  input::-ms-input-placeholder {
    /* Microsoft Edge */
    color: ${(props) =>
      props.variant === 'marketing'
        ? colors.blue.neutral
        : colors.blue.mid} !important;
  }
`
/**
 * Themed inputs
 *
 * We have two themes: ui + marketing
 */
const Input = epitath(function*({
  variant = 'minimal',
  disabled,
  style,
  ...p
}) {
  const { focused, bind } = yield <Focus />
  const defaultProps = {
    px: 4,
    py: 3,
    height: '48px',
    fontSize: 2,
    boxShadow: focused ? 'rgba(16, 112, 202, 0.14) 0px 0px 0px 4px' : undefined
  }
  const uiStyles = {
    borderColor: 'blue.mid',
    border: 1,
    borderRadius: 2,
    color: 'blue.dark',
    height: '48px',
    width: 1
  }
  const marketingStyles = {
    borderColor: 'blue',
    border: 1,
    borderRadius: '48px',
    px: 6,
    fontFamily: 'brand',
    color: 'blue',
    width: 1,
    boxShadow: focused ? 'rgba(16, 112, 202, 0.14) 0px 0px 0px 4px' : 'general'
  }
  const styleProps = variant === 'marketing' ? marketingStyles : uiStyles

  const props = {
    ...defaultProps,
    ...styleProps,
    ...p
  }
  return (
    <StyledInputWrapper variant={variant}>
      <Box
        is="input"
        style={{
          ...style,
          outline: 'none',
          pointerEvents: disabled ? 'none' : undefined
        }}
        disabled={disabled}
        {...props}
        {...bind}
      />
    </StyledInputWrapper>
  )
})

const Textarea = (p) => <Input is="textarea" {...p} />

export { Input, Textarea }
