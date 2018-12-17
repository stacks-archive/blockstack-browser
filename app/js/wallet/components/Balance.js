import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { AccountActions } from '../../account/store/account'
import { SettingsActions } from '../../account/store/settings'
import currencyFormatter from 'currency-formatter'
import roundTo from 'round-to'

import log4js from 'log4js'

const logger = log4js.getLogger(__filename)

const UPDATE_BALANCE_INTERVAL = 30000

function mapStateToProps(state) {
  return {
    addresses: state.account.bitcoinAccount.addresses,
    balances: state.account.bitcoinAccount.balances,
    btcBalanceUrl: state.settings.api.btcBalanceUrl,
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
    btcBalanceUrl: PropTypes.string.isRequired,
    btcPriceUrl: PropTypes.string.isRequired,
    btcPrice: PropTypes.string.isRequired,
    refreshBtcPrice: PropTypes.func.isRequired,
    coreAPIPassword: PropTypes.string
  }

  constructor() {
    super()
    this.btcBalance = this.btcBalance.bind(this)
    this.roundedBtcBalance = this.roundedBtcBalance.bind(this)
    this.usdBalance = this.usdBalance.bind(this)
  }

  componentDidMount() {
    this.props.refreshBalances(this.props.btcBalanceUrl, this.props.addresses)
    this.props.refreshBtcPrice(this.props.btcPriceUrl)
    this.balanceTimer = setInterval(() => {
      logger.debug('balanceTimer: calling refreshBalances...')
      this.props.refreshBalances(this.props.btcBalanceUrl, this.props.addresses)
      this.props.refreshBtcPrice(this.props.btcPriceUrl)
    }, UPDATE_BALANCE_INTERVAL)
  }

  componentWillUnmount() {
    logger.debug('componentWillUnmount: clearing balanceTimer...')
    clearTimeout(this.balanceTimer)
  }

  btcBalance() {
    let btcBalance = 0
    const balances = this.props.balances
    if (balances && balances.total) {
      btcBalance = balances.total
    }
    return btcBalance
  }

  roundedBtcBalance() {
    const btcBalance = this.btcBalance()
    if (!btcBalance) {
      return 0
    } else {
      const roundedAmount = roundTo(btcBalance, 6)
      return roundedAmount
    }
  }

  usdBalance() {
    let btcPrice = this.props.btcPrice
    const btcBalance = this.btcBalance()

    btcPrice = Number(btcPrice)
    const usdBalance = btcPrice * btcBalance
    return currencyFormatter.format(usdBalance, { code: 'USD' })
  }

  render() {
    return (
      <div className="balance m-b-30">
        <div className="balance-sml">
          Balance
        </div>
        <div className="balance-main" title={`${this.btcBalance()} BTC`}>
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
