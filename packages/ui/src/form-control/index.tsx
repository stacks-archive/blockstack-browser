import React, { createContext, useContext, forwardRef } from 'react'
import { Box } from '../box'
import { FormControlProps } from './types'

const FormControlContext = createContext({})

export const useFormControlContext = () => useContext(FormControlContext)

export const useFormControl = (props: any) => {
  const context = useFormControlContext()
  if (!context) {
    return props
  }
  const keys = Object.keys(context)
  return keys.reduce((acc, prop) => {
    /** Giving precedence to `props` over `context` */
    acc[prop] = props[prop]

    if (context) {
      if (props[prop] == null) {
        acc[prop] = context[prop]
      }
    }

    return acc
  }, {})
}

/**
 * FormControl provides context such as `isInvalid`, `isRequired`, `isDisabled` to it's children.
 */
const FormControl = forwardRef<any, FormControlProps>(
  ({ isInvalid, isRequired, isDisabled, isReadOnly, ...rest }, ref) => {
    const context = {
      isRequired,
      isDisabled,
      isInvalid,
      isReadOnly
    }

    return (
      <FormControlContext.Provider value={context}>
        <Box role="group" ref={ref} {...rest} />
      </FormControlContext.Provider>
    )
  }
)

export { FormControl }
