import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

class StatusBar extends Component {
  static propTypes = {
  }

  render() {
    return (
      <div className="statusbar-dark">
        <Link to="/">
          <i className="fa fa-angle-left status-icon"></i>
          <span className="statusbar-btn-home">Home Screen</span>
        </Link>
      </div>
    )
  }
}

export default StatusBar