import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { AccountActions } from '../../store/account'

function mapStateToProps(state) {
  return {
    addresses: state.account.bitcoinAccount.addresses,
    balances: state.account.bitcoinAccount.balances,
    walletPaymentAddressUrl: state.settings.api.walletPaymentAddressUrl,
    utxoUrl: state.settings.api.utxoUrl,
    addressBalanceUrl: state.settings.api.addressBalanceUrl,
    coreWalletBalance: state.account.coreWallet.balance,
    coreWalletAddress: state.account.coreWallet.address
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(AccountActions, dispatch)
}

class Balance extends Component {
  static propTypes = {
    addresses: PropTypes.array.isRequired,
    balances: PropTypes.object.isRequired,
    refreshBalances: PropTypes.func.isRequired,
    walletPaymentAddressUrl: PropTypes.string.isRequired,
    utxoUrl: PropTypes.string.isRequired,
    addressBalanceUrl: PropTypes.string.isRequired,
    refreshCoreWalletBalance: PropTypes.func.isRequired,
    coreWalletBalance: PropTypes.number,
    coreWalletAddress: PropTypes.string
  }

  constructor() {
    super()
  }

  componentDidMount() {
    if(this.props.coreWalletAddress != null) {
      this.props.refreshCoreWalletBalance(this.props.addressBalanceUrl, this.props.coreWalletAddress)
    }
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.coreWalletAddress != nextProps.coreWalletAddress) {
      this.props.refreshCoreWalletBalance(nextProps.addressBalanceUrl, nextProps.coreWalletAddress)
    }
  }

  render() {
    const coreWalletBalance = this.props.coreWalletBalance
    return (
      <div className="balance">
        <div className="balance-main">
          { coreWalletBalance != null ? coreWalletBalance : 0 }
          <label>&nbsp;btc</label>
        </div>
        <div className="balance-sml">
          245.63
          <label>&nbsp;USD</label>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Balance)
