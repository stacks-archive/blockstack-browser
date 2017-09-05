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
        <div className="wallet-sidebar">
          <WalletSidebar activeTab={activeTabUrl} />
        </div>
        <div className="container-fluid wallet-container">
          <div className="col-md-7 wallet-content">
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WalletApp)
