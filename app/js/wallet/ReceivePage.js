import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { AccountActions } from '../store/account'

function mapStateToProps(state) {
  return {
    addresses: state.account.bitcoinAccount.addresses,
    coreWalletAddress: state.account.coreWallet.address,
    walletPaymentAddressUrl: state.settings.api.walletPaymentAddressUrl
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(AccountActions, dispatch)
}

class ReceivePage extends Component {
  static propTypes = {
    addresses: PropTypes.array.isRequired,
    coreWalletAddress: PropTypes.string,
    getCoreWalletAddress: PropTypes.func.isRequired,
    walletPaymentAddressUrl: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props)
  }

  componentWillMount() {
    this.props.getCoreWalletAddress(this.props.walletPaymentAddressUrl)
  }

  render() {
    return (
      <div>
        <h1 className="h1-modern">
            Receive
        </h1>
        <p><i>
          Send at least <strong>0.01 bitcoins</strong> to the address below to register a username.<br/>
          All username registrations use funds from your wallet.
        </i></p>

        { this.props.coreWalletAddress ?
        <div>
          <h5>Send Bitcoins to this address</h5>
          <div className="highlight highlight-wallet">
            <pre>
              <code>{this.props.coreWalletAddress}</code>
            </pre>
          </div>
        </div>
        :
        <div>
          <h5>Loading address...</h5>
        </div>
        }
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReceivePage)
