import PropTypes from 'prop-types'
import React from 'react'

const ActionItem = props => (
  <div>
  {props.completed ? null
  :
    <div className="action-item">
      <div>{props.action}</div>
      <div><small>{props.detail}</small></div>
      <a className="tooltip-link" href={props.destinationUrl}>
       › Go to {props.destinationName}
      </a>
    </div>
  }
  </div>
)

ActionItem.propTypes = {
  action: PropTypes.string.isRequired,
  destinationUrl: PropTypes.string.isRequired,
  destinationName: PropTypes.string.isRequired,
  completed: PropTypes.bool.isRequired,
  detail: PropTypes.string.isRequired
}

export default ActionItem
