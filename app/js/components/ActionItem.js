import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

class ActionItem extends Component {
  static propTypes = {
    action: PropTypes.string.isRequired,
    detail: PropTypes.string.isRequired,
    destinationUrl: PropTypes.string.isRequired,
    destinationName: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired
  }

  render() {
    return (
      <div>
      {this.props.completed ? null
      :
        <div className="action-item">
          <div><b>{this.props.action}</b></div>
          <div><small>{this.props.detail}</small></div>
          <Link className="btn btn-primary btn-sm" to={this.props.destinationUrl}>Go to {this.props.destinationName}</Link>
        </div>
      }
      </div>
    )
  }
}

export default ActionItem
