import PropTypes from 'prop-types'
import React from 'react'

const ActionItem = () => (
  <div>
  {this.props.completed ? null
  :
    <div className="action-item">
      <div>{this.props.action}</div>
      <div><small>{this.props.detail}</small></div>
      <a className="tooltip-link" href={this.props.destinationUrl}> 
        › Go to {this.props.destinationName
      }</a>
    </div>
  }
  </div>
)


ActionItem.PropTypes = {
  action: PropTypes.string.isRequired,
  destinationUrl: PropTypes.string.isRequired,
  destinationName: PropTypes.string.isRequired,
  completed: PropTypes.bool.isRequired
}

export default ActionItem
