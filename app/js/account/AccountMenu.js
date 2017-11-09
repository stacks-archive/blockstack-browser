import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import PageHeader from '../components/PageHeader'
import Navbar from '../components/Navbar'

import { isWebAppBuild, registerWebProtocolHandler } from '../utils/window-utils'

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
    this.clickProtocolHandler = this.clickProtocolHandler.bind(this)
  }

  clickProtocolHandler(event){
    event.preventDefault()
    registerWebProtocolHandler()
  }

  render() {
    const tabs = [
      { url: '/account/storage', label: 'storage providers' },
      { url: '/account/password', label: 'change password' },
      { url: '/account/backup', label: 'backup keychain' },
      { url: '/account/delete', label: 'reset browser' },
      { url: '/account/api', label: 'api settings' }
    ]

    if (isWebAppBuild()) {
      tabs.push( { url: '/account/protocolhandler', label: 'add protocol handler' } )
    }

    return (
      <div>
        <div className="list-group">
          {tabs.map((tab, index) => {
            let className = 'list-group-item item-sidebar-primary'
            if (tab.url === '/account/protocolhandler') {
              return (
                <button key={index} className={className} onClick={this.registerWebProtocolHandler}>
                  {tab.label}
                </button>
              )
            } else {
              return (
                <Link key={index} to={tab.url} className={className}>
                  {tab.label}
                </Link>
              )
            }
          })}
        </div>
      </div>
    )
  }
}

export default connect(null, mapDispatchToProps)(AccountMenu)
