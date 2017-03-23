import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

class StatusBar extends Component {
  static propTypes = {
  }

  render() {
    return (
      <div className="statusbar-dark">
        <Link to="/">
          <div className="statusbar-btn-home">
            ‹ Home
          </div>
        </Link>
      </div>
    )
  }
}

export default StatusBar