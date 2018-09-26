import React from 'react'
import PropTypes from 'prop-types'
import { Rule, Type } from '@blockstack/ui'

const HelperMessage = ({ message }) => (
  <>
    <Rule />
    <Type.small>{message}</Type.small>
  </>
)

HelperMessage.propTypes = {
  message: PropTypes.node.isRequired
}
export { HelperMessage }
