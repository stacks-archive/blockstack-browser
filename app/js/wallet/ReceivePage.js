import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { QRCode } from 'react-qr-svg'

import { AccountActions } from '../account/store/account'
import Balance            from './components/Balance'

import { isCoreEndpointDisabled } from '../utils/window-utils'

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

  componentWillMount() {
    this.props.getCoreWalletAddress(this.props.walletPaymentAddressUrl, this.props.coreAPIPassword)
  }

  render() {
    const address = this.props.addresses[0]
    if (isCoreEndpointDisabled()) {
      return (
        <div>
          <Balance />
          <div className="text-center">
            The Bitcoin wallet is not yet supported in our webapp,
            but the feature is coming soon!
          </div>
        </div>
      )
    }

    return (
      <div>
        <Balance />
        {address ?
          <div>
            <div className="qrcode-wallet">
              <QRCode
                value={address}
              />
            </div>
            <div className="highlight-wallet text-center">
              <pre>
                <code>{address}</code>
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
