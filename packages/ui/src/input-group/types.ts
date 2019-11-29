import { BoxProps } from '../box'
import * as React from 'react'
import { InputSize } from '../input'

interface InputGroupPropsBase {
  size?: InputSize
  children: React.ReactNode
}

export type InputGroupProps = InputGroupPropsBase & BoxProps
