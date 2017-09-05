import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import WalletSidebar from './components/WalletSidebar'
import StatusBar from '../components/StatusBar'


function mapStateToProps(state) {
  return {
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch)
}

class WalletApp extends Component {
  static propTypes = {
  }

  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    const childPath = this.props.children.props.route.path
    const activeTabUrl = `/wallet/${childPath}`

    return (
      <div className="app-wrap-wallet">
          <StatusBar />
        <div className="container-fluid site-wrapper">
          <nav className="navbar navbar-toggleable-md navbar-light">
            <Link to="/wallet/receive" className="navbar-brand">
              <img src="../images/app-icon-wallet-card-flat.png" />
            </Link>
            <div className="navbar-collapse" id="navbarSupportedContent">
              <ul className="nav navbar-nav m-b-20">
                <li className="navbar-text">
                  Wallet
                </li>
                <li className="navbar-text navbar-text-secondary-wallet">
                  Utility
                </li>
              </ul>
            </div>
          </nav>  
          <div className="container wallet-container">
            <div className="col-md-5 wallet-sidebar">
              <WalletSidebar activeTab={activeTabUrl} />
            </div>
            <div className="col-md-7 wallet-content">
              {this.props.children}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WalletApp)
