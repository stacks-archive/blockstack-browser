import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import PageHeader from '../components/PageHeader'
import StatusBar from '../components/StatusBar'

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch)
}

class AccountMenu extends Component {
  static propTypes = {
    children: PropTypes.object
  }

  constructor(props) {
    super(props)

    this.state = { }
  }

  render() {
    const tabs = [
      { url: '/account/storage', label: 'storage providers' },
      { url: '/account/password', label: 'change password' },
      { url: '/account/backup', label: 'backup account' },
      { url: '/account/restore', label: 'restore account' },
      { url: '/account/delete', label: 'delete account' },
      { url: '/account/api', label: 'api settings' }
    ]

    return (
      <div className="list-group">
        {tabs.map((tab, index) => {
          let className = 'list-group-item item-sidebar-primary'
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

export default connect(null, mapDispatchToProps)(AccountMenu)
