import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import HomeButton from '../components/HomeButton'
import WalletSidebar from './components/WalletSidebar'
import PageHeader from '../components/PageHeader'
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
      <div className="body-inner-white">
          <StatusBar />
          <PageHeader title="Wallet" />
        <div className="home-wallet">
        </div>
        <div className="container vertical-split-content">
          <div className="row">
            <div className="col-md-3">
              <WalletSidebar activeTab={activeTabUrl} />
            </div>
            <div className="col-md-9">
              {this.props.children}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WalletApp)
