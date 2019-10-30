import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import SecondaryNavBar from '@components/SecondaryNavBar'
import Navbar from '@components/Navbar'


function mapStateToProps() {
  return {
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch)
}

class WalletApp extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    const childPath = this.props.children.props.route.path
    const activeTabUrl = `/wallet/${childPath}`

    return (
      <div className="container-fluid">
        <div>
          <Navbar activeTab="wallet" />
          <div className="container-fluid col-centered form-container-secondary">
            <strong>NOTE:</strong> This wallet only allows you to add Bitcoin (BTC) to purchase additional identities. You cannot use it with Stacks (STX) tokens. To send and purchase STX, use the Stacks Wallet software instead. See <a href="https://docs.blockstack.org/org/wallet-install.html" target="_blank">the documentation for the Stacks Wallet software</a> for more information. 
          </div>
          <SecondaryNavBar
            leftButtonTitle="Receive"
            leftButtonLink="/wallet/receive"
            isLeftActive={(activeTabUrl === '/wallet/receive')}
            rightButtonTitle="Send"
            rightButtonLink="/wallet/send"
            isRightActive={(activeTabUrl === '/wallet/send')}
            activeClass="active-wallet"
            customButtonClass="btn-wallet"
          />
          <div className="container-fluid col-centered form-container-secondary">
            <div>
              {this.props.children}
            </div>
          </div>
        </div>  
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WalletApp)
