import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

class StatusBar extends Component {
  static propTypes = {
  }

  render() {
    return (
      <div className="status-bar status-bar-dark">
        <Link to="/">
          <i className="fa fa-angle-left status-bar-icon"></i>
          Home Screen
        </Link>
      </div>
    )
  }
}

export default StatusBar