import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { AccountActions } from '../account/store/account'

import Alert from '@components/Alert'
import InputGroupSecondary from '@components/InputGroupSecondary'
import CoreBalance from './components/CoreBalance'

function mapStateToProps(state) {
  return {
    account: state.account,
    inRegTestMode: state.settings.api.regTestMode,
    coreWalletWithdrawUrl: state.settings.api.coreWalletWithdrawUrl,
    broadcastTransactionUrl: state.settings.api.broadcastUrl,
    coreAPIPassword: state.settings.api.coreAPIPassword
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, AccountActions), dispatch)
}

class SendCorePage extends Component {
  static propTypes = {
    account: PropTypes.object.isRequired,
    coreWalletWithdrawUrl: PropTypes.string.isRequired,
    broadcastTransactionUrl: PropTypes.string.isRequired,
    resetCoreWithdrawal: PropTypes.func.isRequired,
    withdrawBitcoinFromCoreWallet: PropTypes.func.isRequired,
    coreAPIPassword: PropTypes.string.isRequired,
    inRegTestMode: PropTypes.bool.isRequired
  }

  constructor(props) {
    super(props)
    this.withdrawAllBitcoin = this.withdrawAllBitcoin.bind(this)

    this.state = {
      alerts: []
    }
    this.updateAlert = this.updateAlert.bind(this)
    this.onValueChange = this.onValueChange.bind(this)
    this.displayCoreWalletWithdrawalAlerts = this.displayCoreWalletWithdrawalAlerts.bind(this)
  }

  componentWillMount() {
    this.props.resetCoreWithdrawal()
  }

  componentWillReceiveProps(nextProps) {
    this.displayCoreWalletWithdrawalAlerts(nextProps)
  }

  componentWillUnmount() {
    this.props.resetCoreWithdrawal()
  }

  onValueChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  updateAlert(alertStatus, alertMessage) {
    this.setState({
      alerts: [{
        status: alertStatus,
        message: alertMessage
      }]
    })
  }

  withdrawAllBitcoin(event) {
    event.preventDefault()
    this.props.withdrawBitcoinFromCoreWallet(
      this.props.coreWalletWithdrawUrl, this.state.recipientAddress,
      this.props.coreAPIPassword)
    return
  }

  displayCoreWalletWithdrawalAlerts(props) {
    if (props.account.hasOwnProperty('coreWallet')) {
      const withdrawal = props.account.coreWallet.withdrawal

      this.setState({
        alerts: []
      })
      if (!props.inRegTestMode) {
        this.updateAlert(
          'danger', 'The core wallet is only used in regtest ' +
            'mode. Are you trying to use regtest?')
      } else if (withdrawal.inProgress) {
        this.updateAlert('success',
        `Preparing to send your balance to ${withdrawal.recipientAddress}...`)
      } else if (withdrawal.error !== null) {
        console.error(withdrawal.error)
        this.updateAlert('danger', 'Withdrawal failed.')
      } else if (withdrawal.success) {
        this.updateAlert('success',
        `Your bitcoins have been sent to ${withdrawal.recipientAddress}`)
      }
    }
  }

  render() {
    const disabled = this.props.account.coreWallet.withdrawal.inProgress ||
          !this.props.inRegTestMode
    return (
      <div>
        {this.state.alerts.map((alert, index) =>
           (
          <Alert key={index} message={alert.message} status={alert.status} />
          )
        )}
        <CoreBalance />
        <p>Send your legacy Core wallet funds to another Bitcoin wallet.</p>
        <form onSubmit={this.withdrawAllBitcoin}>
          <InputGroupSecondary
            data={this.state}
            onChange={this.onValueChange}
            name="recipientAddress"
            label="To"
            placeholder="1Mp5vKwCbekeWetMHLKDD2fDLJzw4vKxiQ"
            required
          />
          <InputGroupSecondary
            data={this.state}
            onChange={this.onValueChange}
            name="password" label="Password"
            placeholder="Password" type="password"
            required
          />
          <div className="m-t-40 m-b-75">
            <button className="btn btn-light btn-block" type="submit" disabled={disabled}>
              Send
            </button>
          </div>
        </form>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SendCorePage)
