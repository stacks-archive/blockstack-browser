import React from 'react'
import styled from 'styled-components'
import { Box } from '../primitives'
import { theme } from '../../common'

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
const Input = ({ variant = 'minimal', ...p }) => {
  const defaultProps = {
    px: 4,
    py: 3,
    height: '48px',
    fontSize: 2
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
    boxShadow: 'general'
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
          outline: 'none'
        }}
        {...props}
      />
    </StyledInputWrapper>
  )
}

const Textarea = (p) => <Input is="textarea" {...p} />

export { Input, Textarea }
