import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

class StatusBar extends Component {
  static propTypes = {
    hideBackToHomeLink: PropTypes.bool
  }

  render() {
    return (
      <div className="status-bar status-bar-dark">
        {this.props.hideBackToHomeLink ?
          null
        :
          <Link to="/" style={{ width: '150px' }}>
            <i className="fa fa-angle-left status-bar-icon"></i>
            Home Screen
          </Link>
        }
      </div>
    )
  }
}

export default StatusBar
