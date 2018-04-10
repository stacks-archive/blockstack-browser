import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { AccountActions } from '../../account/store/account'
import { SettingsActions } from '../../account/store/settings'
import currencyFormatter from 'currency-formatter'
import roundTo from 'round-to'

function mapStateToProps(state) {
  return {
    addresses: state.account.bitcoinAccount.addresses,
    balances: state.account.bitcoinAccount.balances,
    walletPaymentAddressUrl: state.settings.api.walletPaymentAddressUrl,
    addressBalanceUrl: state.settings.api.zeroConfBalanceUrl,
    coreWalletBalance: state.account.coreWallet.balance,
    coreWalletAddress: state.account.coreWallet.address,
    btcPriceUrl: state.settings.api.btcPriceUrl,
    btcPrice: state.settings.api.btcPrice,
    coreAPIPassword: state.settings.api.coreAPIPassword
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
    addressBalanceUrl: PropTypes.string.isRequired,
    refreshCoreWalletBalance: PropTypes.func.isRequired,
    coreWalletBalance: PropTypes.number,
    coreWalletAddress: PropTypes.string,
    btcPriceUrl: PropTypes.string.isRequired,
    btcPrice: PropTypes.string.isRequired,
    refreshBtcPrice: PropTypes.func.isRequired,
    coreAPIPassword: PropTypes.string
  }

  constructor() {
    super()
    this.roundedBtcBalance = this.roundedBtcBalance.bind(this)
    this.usdBalance = this.usdBalance.bind(this)
  }

  componentDidMount() {
    this.props.refreshCoreWalletBalance(this.props.addressBalanceUrl,
          this.props.coreAPIPassword)
    this.props.refreshBtcPrice(this.props.btcPriceUrl)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.coreWalletAddress !== nextProps.coreWalletAddress) {
      this.props.refreshCoreWalletBalance(nextProps.addressBalanceUrl, this.props.coreAPIPassword)
    }
  }

  roundedBtcBalance() {
    const btcBalance = this.props.coreWalletBalance
    if (btcBalance === null) {
      return 0
    } else {
      const roundedAmount = roundTo(btcBalance, 6)
      return roundedAmount
    }
  }

  usdBalance() {
    let btcPrice = this.props.btcPrice
    const btcBalance = this.props.coreWalletBalance

    btcPrice = Number(btcPrice)
    const usdBalance = btcPrice * btcBalance
    return currencyFormatter.format(usdBalance, { code: 'USD' })
  }

  render() {
    const coreWalletBalance = this.props.coreWalletBalance
    return (
      <div className="balance m-b-30">
        <div className="balance-main" title={`${coreWalletBalance} BTC`}>
          {this.roundedBtcBalance()}
          <label>&nbsp;BTC</label>
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
