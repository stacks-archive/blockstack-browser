import React from 'react'
import PropTypes from 'prop-types'

const SupportButton = props => (
  <div className="support-floater clickable" onClick={props.onClick}>
    ?
  </div>
)

SupportButton.propTypes = {
  onClick: PropTypes.func
}

export default SupportButton
