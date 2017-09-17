import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import SecondaryNavBar from '../components/SecondaryNavBar'
import WalletSidebar from './components/WalletSidebar'
import Navbar from '../components/Navbar'


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
        <Navbar activeTab="wallet"/>
        <SecondaryNavBar 
          leftButtonTitle="Receive" 
          leftButtonLink="/wallet/receive"
          isLeftActive={(activeTabUrl === '/wallet/receive')}
          rightButtonTitle="Send" 
          rightButtonLink="/wallet/send"
          isRightActive={(activeTabUrl === '/wallet/send')} />
        <div>
          <div className="row">
            <div className="container-fluid col-centered container-primary">
              <div>
                {this.props.children}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WalletApp)
