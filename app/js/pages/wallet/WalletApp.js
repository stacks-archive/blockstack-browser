import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { WalletSidebar, PageHeader, StatusBar } from '../../components/index'

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
      <div className="body-inner bkg-green">
          <StatusBar />
        <div className="home-wallet">
        </div>
        <div className="container wallet-container">
          <div className="col-md-4 col-lg-3 wallet-sidebar">
            <WalletSidebar activeTab={activeTabUrl} />
          </div>
          <div className="col-md-8 col-lg-9 wallet-content">
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WalletApp)
