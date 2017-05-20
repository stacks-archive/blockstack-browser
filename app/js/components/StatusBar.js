import React, { Component } from 'react'
import { Link } from 'react-router'

import Image from './../components/Image'

class StatusBar extends Component {
  static propTypes = {
  }

  render() {
    return (
      <div className="status-bar status-bar-dark">
        <Link to="/" style={{ width: '150px' }}>
          <i className="fa fa-angle-left status-bar-icon"></i>
          Home Screen
        </Link>
        <div className="pull-right">
          <div className="status-inline status-completion">
            <Image className="status-complete-dot img-circle" />
            <Image className="status-complete-dot img-circle" />
            <Image className="status-complete-dot img-circle" />
            <Image className="status-complete-dot img-circle" />
            <Image className="status-complete-dot img-circle" />
          </div>
          <div className="status-inline zstatus-balance">
            <p>Balance 0.0009233 BTC</p>
          </div>
          <div className="status-inline zstatus-profile">
            <Image className="status-profile-img img-circle" src="/images/avatar.png" />
          </div>
        </div>
      </div>
    )
  }
}

export default StatusBar