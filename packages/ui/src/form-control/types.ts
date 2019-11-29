import * as React from 'react'
import { BoxProps } from '../box'

interface IFormControlBase {
  /**
   * Content of the form control.
   */
  children?: React.ReactNode
  /**
   * If `true` set the form control to the invalid state.
   */
  isInvalid?: boolean
  /**
   * If `true` set the form control to be required.
   */
  isRequired?: boolean
  /**
   * If `true` set the form control to the disabled state.
   */
  isDisabled?: boolean
  isReadOnly?: boolean
}

export type FormControlProps = IFormControlBase & BoxProps
