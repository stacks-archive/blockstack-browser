import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { AccountActions } from '../../store/account'
import { SettingsActions } from '../../store/settings'
import currencyFormatter from 'currency-formatter'

function mapStateToProps(state) {
  return {
    addresses: state.account.bitcoinAccount.addresses,
    balances: state.account.bitcoinAccount.balances,
    walletPaymentAddressUrl: state.settings.api.walletPaymentAddressUrl,
    utxoUrl: state.settings.api.utxoUrl,
    addressBalanceUrl: state.settings.api.addressBalanceUrl,
    coreWalletBalance: state.account.coreWallet.balance,
    coreWalletAddress: state.account.coreWallet.address,
    btcPriceUrl: state.settings.api.btcPriceUrl,
    btcPrice: state.settings.api.btcPrice
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, AccountActions, SettingsActions), dispatch)
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
    coreWalletAddress: PropTypes.string,
    btcPriceUrl: PropTypes.string.isRequired,
    btcPrice: PropTypes.string.isRequired,
    refreshBtcPrice: PropTypes.func.isRequired
  }

  constructor() {
    super()
    this.usdBalance = this.usdBalance.bind(this)
  }

  componentDidMount() {
    if (this.props.coreWalletAddress !== null) {
      this.props.refreshCoreWalletBalance(this.props.addressBalanceUrl,
        this.props.coreWalletAddress)
    }
    this.props.refreshBtcPrice(this.props.btcPriceUrl)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.coreWalletAddress !== nextProps.coreWalletAddress) {
      this.props.refreshCoreWalletBalance(nextProps.addressBalanceUrl, nextProps.coreWalletAddress)
    }
  }

  usdBalance() {
    let btcPrice = this.props.btcPrice
    const btcBalance = this.props.coreWalletBalance

    btcPrice = Number(btcPrice)
    let usdBalance = btcPrice * btcBalance
    return currencyFormatter.format(usdBalance, { code: 'USD' })
  }

  render() {
    const coreWalletBalance = this.props.coreWalletBalance
    return (
      <div className="balance">
        <div className="balance-main">
          {coreWalletBalance != null ? coreWalletBalance : 0}
          <label>&nbsp;btc</label>
        </div>
        <div className="balance-sml">
          {this.usdBalance()}
          <label>&nbsp;USD</label>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Balance)
