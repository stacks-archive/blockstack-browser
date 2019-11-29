import React, { forwardRef } from 'react'
import styled, { keyframes } from 'styled-components'
import { Box } from '../box'
import { VisuallyHidden } from '../visually-hidden'
import { SpinnerProps, SpinnerSize } from './types'

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`

const StyledBox = styled(Box)`
  animation: ${spin} ${(props: SpinnerProps) => props.speed} linear infinite;
`

const sizes = {
  xs: '0.75rem',
  sm: '1rem',
  md: '1.5rem',
  lg: '2rem',
  xl: '3rem'
}

/**
 * Spinner is used for indicating a loading state of a component or page.
 *
 * RECOMMENDED: Add `aria-busy="true"` to the component that triggered the loading state while the spinner is shown.
 */
const Spinner = forwardRef<any, SpinnerProps>(
  (
    {
      size = 'md',
      label = 'Loading...',
      thickness = '2px',
      speed = '0.85s',
      color,
      emptyColor = 'transparent',
      ...props
    },
    ref
  ) => {
    const _size = (sizes[size] || size) as SpinnerSize

    return (
      <StyledBox
        ref={ref}
        display="inline-block"
        borderWidth={thickness}
        borderColor="currentColor"
        borderBottomColor={emptyColor}
        borderLeftColor={emptyColor}
        borderRadius="100%"
        speed={speed}
        color={color}
        size={_size}
        {...props}
      >
        {label && <VisuallyHidden>{label}</VisuallyHidden>}
      </StyledBox>
    )
  }
)

export { Spinner }
