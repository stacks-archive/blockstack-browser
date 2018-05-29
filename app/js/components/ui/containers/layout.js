import React from 'react'
import PropTypes from 'prop-types'
import { Rule, Type } from '@blockstack/ui'

const HelperMessage = ({ message }) => (
  <React.Fragment>
    <Rule />
    <Type.small>{message}</Type.small>
  </React.Fragment>
)

HelperMessage.propTypes = {
  message: PropTypes.node.isRequired
}
export { HelperMessage }
