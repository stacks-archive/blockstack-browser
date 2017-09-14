import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { QRCode } from 'react-qr-svg'

import { AccountActions } from '../account/store/account'
import Balance            from './components/Balance'

function mapStateToProps(state) {
  return {
    addresses: state.account.bitcoinAccount.addresses,
    coreWalletAddress: state.account.coreWallet.address,
    walletPaymentAddressUrl: state.settings.api.walletPaymentAddressUrl,
    coreAPIPassword: state.settings.api.coreAPIPassword
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
    walletPaymentAddressUrl: PropTypes.string.isRequired,
    coreAPIPassword: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props)
  }

  componentWillMount() {
    this.props.getCoreWalletAddress(this.props.walletPaymentAddressUrl, this.props.coreAPIPassword)
  }

  render() {
    return (
      <div>
        <Balance />
          <div className="m-b-25 text-center">
            <p>
              Send at least 0.01 bitcoins to the address below to register a 
              username. All username registrations use funds from your wallet.
            </p>
          </div>
        { this.props.coreWalletAddress ?
        <div>
          {/* 
          <div className="m-b-25">
            <p className="font-weight-bold">Send Bitcoins to this address:</p>
          </div>
          */}
          <div className="qrcode-wallet">
            <QRCode
              value={this.props.coreWalletAddress}
            />
          </div>
          <div className="highlight-wallet text-center">
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
