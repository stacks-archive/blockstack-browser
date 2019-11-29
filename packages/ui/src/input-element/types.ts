import { InputSize } from '../input'
import * as React from 'react'
import { BoxProps } from '../box'
import { Omit } from '../common-types'

interface InputElementPropsBase {
  /**
   * The size of the adornment is inherited from the `InputGroup` via `cloneElement`.
   */
  size?: InputSize
  /**
   * The position this adornment should appear relative to the `Input`.
   * We added `InputLeftElement` and `InputRightElement` so you might not need to pass this
   */
  placement?: 'left' | 'right'
  /**
   * The content of the component, normally an `IconButton` or string.
   */
  children: React.ReactNode
  /**
   * Disable pointer events on this component.
   * This allows for the content of the adornment to focus the input on click.
   */
  disablePointerEvents?: boolean
}

export type InputElementProps = InputElementPropsBase & BoxProps

export type PositionedInputElementProps = Omit<InputElementProps, 'placement'>
