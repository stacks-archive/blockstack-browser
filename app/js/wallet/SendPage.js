import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
  decryptMasterKeychain,
  getBitcoinPrivateKeychain,
  getBitcoinAddressNode
} from '../utils'

import Alert from '../components/Alert'
import InputGroupSecondary from '../components/InputGroupSecondary'
import Balance from './components/Balance'

function mapStateToProps(state) {
  return {
    account: state.account,
    regTestMode: state.settings.api.regTestMode
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, AccountActions), dispatch)
}

class SendPage extends Component {
  static propTypes = {
    account: PropTypes.object.isRequired,
    regTestMode: PropTypes.bool.isRequired,
    resetCoreWithdrawal: PropTypes.func.isRequired,
    withdrawBitcoinClientSide: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.withdrawBitcoin = this.withdrawBitcoin.bind(this)

    this.state = {
      alerts: [],
      amount: '',
      password: '',
      recipientAddress: '',
      disabled: false,
      lastAmount: ''
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

  withdrawBitcoin(event) {
    event.preventDefault()
    this.setState({
      disabled: true
    })
    const password = this.state.password
    const encryptedBackupPhrase = this.props.account.encryptedBackupPhrase
    decryptMasterKeychain(password, encryptedBackupPhrase)
    .then((masterKeychain) => {
      const bitcoinPrivateKeychain = getBitcoinPrivateKeychain(masterKeychain)
      const bitcoinAddressHDNode = getBitcoinAddressNode(bitcoinPrivateKeychain, 0)
      const paymentKey = bitcoinAddressHDNode.keyPair.d.toBuffer(32).toString('hex')
      const amount = this.state.amount
      const recipientAddress = this.state.recipientAddress

      this.setState({
        lastAmount: amount
      })

      this.props.withdrawBitcoinClientSide(
        this.props.regTestMode, `${paymentKey}01`, recipientAddress, amount)
      this.setState({
        amount: '',
        password: '',
        recipientAddress: '',
        lastAmount: this.state.amount
      })
    })
    .catch((error) => {
      this.setState({
        disabled: false
      })
      this.updateAlert('danger', error.toString())
      console.error(error)
    })
  }

  displayCoreWalletWithdrawalAlerts(props) {
    if (props.account.hasOwnProperty('coreWallet')) {
      const withdrawal = props.account.coreWallet.withdrawal
      const amount = this.state.lastAmount
      this.setState({
        alerts: []
      })

      if (withdrawal.inProgress) {
        this.updateAlert('success',
        `Preparing to send ${amount} bitcoins to ${withdrawal.recipientAddress}...`)
      } else if (withdrawal.error !== null) {
        this.updateAlert('danger', withdrawal.error)
      } else if (withdrawal.success) {
        this.setState({
          disabled: false
        })
        this.updateAlert('success',
        `Sent up to ${amount} bitcoins to ${withdrawal.recipientAddress}`)
      }
    }
  }

  render() {
    const disabled = this.state.disabled

    return (
      <div>
        {this.state.alerts.map((alert, index) =>
           (
          <Alert key={index} message={alert.message} status={alert.status} />
          )
        )}
        <Balance />
        <form onSubmit={this.withdrawBitcoin}>
          <InputGroupSecondary
            data={this.state}
            onChange={this.onValueChange}
            name="recipientAddress"
            label="To"
            placeholder="&nbsp;"
            required
          />
          <InputGroupSecondary
            data={this.state}
            onChange={this.onValueChange}
            name="amount"
            label="Amount"
            placeholder="&nbsp;"
            type="number"
            required
            step={0.000001}
          />
          <InputGroupSecondary
            data={this.state}
            onChange={this.onValueChange}
            name="password"
            label="Password"
            placeholder="&nbsp;"
            type="password"
            required
          />
          <div className="m-t-40 m-b-75">
            <button className="btn btn-primary btn-block" type="submit" disabled={disabled}>
              {disabled ?
                <span>Sending...</span>
              :
                <span>Send</span>
              }
            </button>
          </div>
        </form>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SendPage)
