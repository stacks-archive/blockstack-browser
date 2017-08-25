import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

class AccountSidebar extends Component {
  static propTypes = {
    activeTab: PropTypes.string
  }

  render() {
    const tabs = [
      { url: '/account/storage', label: 'storage providers', isActive: false },
      { url: '/account/password', label: 'change password', isActive: false },
      { url: '/account/backup', label: 'backup account', isActive: false },
      { url: '/account/restore', label: 'restore account', isActive: false },
      { url: '/account/delete', label: 'delete account', isActive: false },
      { url: '/account/api', label: 'api settings', isActive: false }

    ]
    tabs.map((tab) => {
      if (tab.url === this.props.activeTab) {
        tab.isActive = true
      }
    })

    return (
      <div className="list-group">
        {tabs.map((tab, index) => {
          let className = 'list-group-item item-sidebar-account'
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

export default AccountSidebar
