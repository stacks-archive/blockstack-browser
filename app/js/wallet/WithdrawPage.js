import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { AccountActions } from '../store/account'

import { PublicKeychain } from 'blockstack'

import {
  broadcastTransaction, decryptPrivateKeychain, getNetworkFee,
  getBitcoinPrivateKeychain, getUtxo, authorizationHeaderValue
} from '../utils'
import Alert from '../components/Alert'
import InputGroup from '../components/InputGroup'
import Balance from './components/Balance'

import { ECPair, ECKey, TransactionBuilder } from 'bitcoinjs-lib'

function mapStateToProps(state) {
  return {
    account: state.account,
    coreWalletWithdrawUrl: state.settings.api.coreWalletWithdrawUrl,
    broadcastTransactionUrl: state.settings.api.broadcastTransactionUrl
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, AccountActions), dispatch)
}

class WithdrawPage extends Component {
  static propTypes = {
    account: PropTypes.object.isRequired,
    coreWalletWithdrawUrl: PropTypes.string.isRequired,
    broadcastTransactionUrl: PropTypes.string.isRequired,
    resetCoreWithdrawal: PropTypes.func.isRequired,
    withdrawBitcoinFromCoreWallet: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.withdrawBitcoin = this.withdrawBitcoin.bind(this)

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

  componentWillUnmount() {
    this.props.resetCoreWithdrawal()
  }

  componentWillReceiveProps(nextProps) {
    this.displayCoreWalletWithdrawalAlerts(nextProps)
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

    this.props.withdrawBitcoinFromCoreWallet(this.props.coreWalletWithdrawUrl, this.state.recipientAddress)
    return // temporary until we switch back to built in wallet

    const password = this.state.password

    decryptPrivateKeychain(password, this.props.account.encryptedBackupPhrase)
    .then((privateKeychain) => {
     const bitcoinPrivateKeychain = getBitcoinPrivateKeychain(privateKeychain)

     const key = ECPair.fromWIF(bitcoinPrivateKeychain.ecPair.toWIF())
     const address = bitcoinPrivateKeychain.ecPair.getAddress()

     let tx = new TransactionBuilder()
     let totalSatoshis = 0

     const recipientAddress = this.state.recipientAddress

     getUtxo(address).then((utxo) => {

       for(let i = 0; i < utxo.length; i++) {
         let input = utxo[i]
         tx.addInput(input.txid, input.vout)
         totalSatoshis = totalSatoshis + input.satoshis
       }

     let clonedTx = TransactionBuilder.fromTransaction(tx.buildIncomplete())
     clonedTx.addOutput(recipientAddress, totalSatoshis)
     clonedTx.sign(0, key)
     const wrongFeeTransaction = clonedTx.build()
     const byteLength = wrongFeeTransaction.byteLength()


     getNetworkFee(byteLength).then((fee) => {
       const amountToSend = totalSatoshis - fee

       console.log(`Amount to send to ${recipientAddress}: ${amountToSend} Network fee: ${fee}`)

       // TODO: instead of 0 we should use dust amount
       if(amountToSend <= 0) {
          this.updateAlert('danger', "There isn't enough bitcoin to pay the network fee.")
       } else {
         tx.addOutput(recipientAddress, amountToSend)

         tx.sign(0, key)

         const rawTransaction = tx.build().toHex()

         broadcastTransaction(rawTransaction).then((result) => {
           console.log(result)
           this.updateAlert('success', "Transaction sent!")

         }).catch((error) => {
           console.log(error)
           this.updateAlert('danger', "There was a problem broadcasting the transaction")
         })
       }
     })

     }).catch((error) => {
       this.updateAlert('danger', error.toString())

       console.error(error)
     })


    }).catch((error) => {
      this.updateAlert('danger', error.toString())

      console.error(error)
    })
  }

  displayCoreWalletWithdrawalAlerts(props) {
    if(props.account.hasOwnProperty('coreWallet')) {
      const withdrawal = props.account.coreWallet.withdrawal

      this.setState({
        alerts: []
      })

      if(withdrawal.inProgress) {
        this.updateAlert('success', `Preparing to send your balance to ${withdrawal.recipientAddress}...`)
      } else if(withdrawal.error !== null) {
        console.error(withdrawal.error)
        this.updateAlert('danger', 'Withdrawal failed.')
      } else if(withdrawal.success) {
        this.updateAlert('success', `Your bitcoins have been sent to ${withdrawal.recipientAddress}`)
      }
    }
  }

  render() {
    const disabled = this.props.account.coreWallet.withdrawal.inProgress
    return (
      <div>
        { this.state.alerts.map(function(alert, index) {
          return (
            <Alert key={index} message={alert.message} status={alert.status} />
          )
        })}
        <Balance />
        <p>Send your funds to another Bitcoin wallet.</p>
        <form onSubmit={this.withdrawBitcoin} method='post'>
        <InputGroup data={this.state} onChange={this.onValueChange}
          name="recipientAddress" label="Recipient address"
          placeholder="Recipient address" required={true}/>
        <InputGroup data={this.state} onChange={this.onValueChange}
          name="password" label="Password"
          placeholder="Password" type="password" required={true}/>
        <div className="container m-t-40">
          <button className="btn btn-primary" type="submit" disabled={disabled}>Send</button>
        </div>
        </form>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WithdrawPage)
