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
            <strong>NOTE:</strong> You cannot use this wallet to send and receive Stacks (STX) tokens. Also, you cannot use the Bitcoin (BTC) address on this page to fund STX transactions. This wallet and its address <strong>only</strong> support the purchase of Blockstack identities (IDs). <strong>To create or fund STX transactions, use the Stacks Wallet software.</strong> See <a href="https://docs.blockstack.org/org/wallet-install.html" target="_blank">the Stacks Wallet software documentation</a> for more information. 
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
