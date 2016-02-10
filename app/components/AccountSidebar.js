import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

class AccountSidebar extends Component {
  static propTypes = {
    activeTab: PropTypes.string
  }

  render() {
    let tabs = [
      { url: '/account/deposit', label: 'deposit', isActive: false },
      { url: '/account/withdraw', label: 'withdraw', isActive: false },
      { url: '/account/password', label: 'change password', isActive: false },
      { url: '/account/backup', label: 'backup account', isActive: false },
      { url: '/account/delete', label: 'delete account', isActive: false },
      { url: '/account/settings', label: 'settings', isActive: false },
    ]
    tabs.map((tab) => {
      if (tab.label === this.props.activeTab) {
        tab.isActive = true
      }
    })

    return (
      <div className="list-group">
        {tabs.map((tab, index) => {
          let className = 'list-group-item'
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

/*
        <Link to="/account/deposit" className={`list-group-item ${}`}>
          Deposit
        </Link>
        <Link to="/account/withdraw" className="list-group-item">
          Withdraw
        </Link>
        <Link to="/account/password" className="list-group-item">
          Change Password
        </Link>
        <Link to="/account/backup" className="list-group-item">
          Backup Account
        </Link>
        <Link to="/account/delete" className="list-group-item">
          Delete Account
        </Link>
        <Link to="/account/settings" className="list-group-item">
          Settings
        </Link>
*/