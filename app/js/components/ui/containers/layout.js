import React from 'react'
import { Rule, Type } from '@blockstack/ui'

const HelperMessage = ({ message, ...rest }) => (
  <React.Fragment>
    <Rule />
    <Type.small>{message}</Type.small>
  </React.Fragment>
)

export { HelperMessage }
