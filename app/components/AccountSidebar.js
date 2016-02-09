import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

class AccountSidebar extends Component {
  static propTypes = {
  }

  render() {
    return (
      <div className="list-group">
        <Link to="/account/deposit" className="list-group-item">
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
      </div>
    )
  }
}

export default AccountSidebar