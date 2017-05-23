import React, { Component } from 'react'
import { Link } from 'react-router'

import Image from './../components/Image'
import Completion from './Completion'
import ActionItem from './ActionItem'
import { Popover, OverlayTrigger } from 'react-bootstrap'

const popover = (
  <Popover>
    <ActionItem
      action="Connect a storage provider to regain control of your data"
      destinationUrl="/storage/providers"
      destinationName="Storage"
      completed={false}
    />
    <ActionItem
      action="Create your first profile independent of 3rd parties"
      destinationUrl="/profiles"
      destinationName="Profiles"
      completed={false}
    />
    <ActionItem
      action="Sign in to your first Blockstack app"
      destinationUrl="https://helloblockstack.com"
      destinationName="Apps"
      completed={false}
    />
    <ActionItem
      action="Write down your backup code for keychain recovery"
      destinationUrl="/account/backup"
      destinationName="Backup"
      completed={false}
    />
    <ActionItem
      action="Deposit Bitcoin to enable username registration"
      destinationUrl="/wallet/receive"
      destinationName="Wallet"
      completed={false}
    />
    <ActionItem
      action="Register a username for your profile"
      destinationUrl="/wallet/receive"
      destinationName="Wallet"
      completed={false}
    />
  </Popover>
)

class StatusBar extends Component {
  static propTypes = {
  }

  render() {
    return (
      <div className="status-bar status-bar-transparent-dark">
        <Link to="/" className="status-bar-back">
          <i className="fa fa-angle-left status-bar-icon"></i>
          Home Screen
        </Link>
        <div className="pull-right">
          <div className="status-inline status-completion">
            <div className="status-complete-wrap">
              <OverlayTrigger trigger={['click']} placement="bottom" overlay={popover}>
                <div className="status-complete-dot">
                  <div className="status-complete-object img-circle">6</div>
                </div>
              </OverlayTrigger>
            </div>
          </div>
          <div className="status-inline status-balance">
            <p>Balance 0.0009233 BTC</p>
          </div>
          <div className="status-inline status-profile">
            <Image className="status-profile-img img-circle" src="/images/avatar.png" />
          </div>
        </div>
      </div>
    )
  }
}

export default StatusBar
