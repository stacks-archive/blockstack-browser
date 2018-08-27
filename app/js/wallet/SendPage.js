import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
  decryptMasterKeychain,
  getBitcoinPrivateKeychain,
  getBitcoinAddressNode
} from '../utils'

import { AccountActions } from '../account/store/account'

import Alert from '@components/Alert'
import InputGroupSecondary from '@components/InputGroupSecondary'
import Balance from './components/Balance'
import ConfirmTransactionModal from './components/ConfirmTransactionModal'
import SimpleButton from '@components/SimpleButton'

function mapStateToProps(state) {
  return {
    account: state.account,
    regTestMode: state.settings.api.regTestMode,
    localIdentities: state.profiles.identity.localIdentities
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, AccountActions), dispatch)
}

class SendPage extends Component {
  static propTypes = {
    account: PropTypes.object.isRequired,
    regTestMode: PropTypes.bool.isRequired,
    localIdentites: PropTypes.array.isRequired,
    resetCoreWithdrawal: PropTypes.func.isRequired,
    buildBitcoinTransaction: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      alerts: [],
      amount: '',
      password: '',
      recipientAddress: '',
      isConfirming: false
    }
  }

  componentWillMount() {
    this.props.resetCoreWithdrawal()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.localIdentities.map(x => x.usernamePending).includes(true)) {
      this.updateAlert('danger', 'You have a pending name registration. Withdrawing bitcoin' +
                       ' may interfere with that registration\'s bitcoin transactions.')
    }

    // Handle changes in withdrawal state
    if (this.props.account.coreWallet) {
      const thisWithdrawal = this.props.account.coreWallet.withdrawal
      const nextWithdrawal = nextProps.account.coreWallet.withdrawal

      if (nextWithdrawal.txHex && thisWithdrawal.txHex !== nextWithdrawal.txHex) {
        this.setState({ isConfirming: true })
      }
      else if (nextWithdrawal.error && thisWithdrawal.error !== nextWithdrawal.error) {
        this.updateAlert('danger', nextWithdrawal.error)
        this.closeConfirmation()
      }
      else if (!thisWithdrawal.success && nextWithdrawal.success) {
        this.closeConfirmation()
        this.updateAlert('success', 'Your transaction was succesfully broadcasted!')
      }
    }
  }

  componentWillUnmount() {
    this.props.resetCoreWithdrawal()
  }

  onValueChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  updateAlert = (alertStatus, alertMessage) => {
    this.setState({
      alerts: [{
        status: alertStatus,
        message: alertMessage
      }]
    })
  }

  buildTransaction = (event) => {
    event.preventDefault()
    const { password, amount, recipientAddress } = this.state
    const { account, regTestMode } = this.props
    const btcAddress = account.bitcoinAccount.addresses[0]
    const balance = account.bitcoinAccount.balances[btcAddress]

    if (!password || !amount || !recipientAddress) {
      this.updateAlert('danger', 'All fields are required')
      return
    }

    if (parseFloat(amount) > balance) {
      this.updateAlert(
        'danger',
        'Amount exceeds balance. Use "Send all" if you’d like to send the maximum amount.'
      )
      return
    }

    // TODO: Move decrypt logic to action & blockstack.js
    this.setState({
      disabled: true,
      alerts: []
    })
    decryptMasterKeychain(password, account.encryptedBackupPhrase)
    .then(masterKeychain => {
      const bitcoinPrivateKeychain = getBitcoinPrivateKeychain(masterKeychain)
      const bitcoinAddressHDNode = getBitcoinAddressNode(bitcoinPrivateKeychain, 0)
      const paymentKey = bitcoinAddressHDNode.keyPair.d.toBuffer(32).toString('hex')

      this.props.buildBitcoinTransaction(
        regTestMode,
        `${paymentKey}01`,
        recipientAddress,
        amount
      )
    })
  }

  closeConfirmation = () => {
    this.setState({
      isConfirming: false,
      disabled: false
    })
  }

  setAmountAll = () => {
    const { bitcoinAccount } = this.props.account
    const btcAddress = bitcoinAccount.addresses[0]
    this.setState({ amount: bitcoinAccount.balances[btcAddress].toString() })
  }

  render() {
    const { bitcoinAccount } = this.props.account
    const { isConfirming, disabled } = this.state
    const btcAddress = bitcoinAccount.addresses[0]
    const balance = bitcoinAccount.balances[btcAddress]

    return (
      <div>
        <Balance />
        {this.state.alerts.map(alert =>
          <Alert key={alert.message} message={alert.message} status={alert.status} />
        )}
        <form onSubmit={this.buildTransaction}>
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
            step={1e-8}
            min="0"
            action={balance ? {
              text: 'Send all',
              onClick: this.setAmountAll
            } : null}
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
            <SimpleButton type="primary" block loading={disabled}>
              Make transaction
            </SimpleButton>
          </div>
        </form>

        <ConfirmTransactionModal
          isOpen={isConfirming}
          handleClose={this.closeConfirmation}
          txHex={this.props.account.coreWallet.withdrawal.txHex}
        />
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SendPage)
