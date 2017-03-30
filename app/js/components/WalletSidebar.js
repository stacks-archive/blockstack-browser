import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

import { Balance } from '../components/index'

class WalletSidebar extends Component {
  static propTypes = {
    activeTab: PropTypes.string
  }

  render() {
    let tabs = [
      { url: '/wallet/receive', label: 'receive', isActive: false },
      { url: '/wallet/withdraw', label: 'withdraw', isActive: false }
    ]
    tabs.map((tab) => {
      if (tab.url === this.props.activeTab) {
        tab.isActive = true
      }
    })

    return (
      <div className="list-group">
        <Balance />
        {tabs.map((tab, index) => {
          let className = 'list-group-item list-group-item-sidebar'
          if (tab.isActive) {
            className += ' active'
          }
          return (
            <Link key={index} to={tab.url} className={className}>
              {tab.label}
            </Link>
          )
        })}
      </div>
    )
  }
}

export default WalletSidebar
