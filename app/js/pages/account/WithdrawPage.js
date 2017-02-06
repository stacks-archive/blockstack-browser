import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { PublicKeychain } from 'blockstack-keychains'

import { broadcastTransaction, decryptPrivateKeychain, getNetworkFee, getBitcoinPrivateKeychain, getUtxo } from '../../utils'


import { InputGroup, AccountSidebar, Balance, PageHeader } from '../../components/index'

import { ECPair, ECKey, TransactionBuilder } from 'bitcoinjs-lib'

function mapStateToProps(state) {
  return {
    account: state.account
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch)
}

class WithdrawPage extends Component {
  static propTypes = {

  }

  constructor(props) {
    super(props)
    this.withdrawBitcoin = this.withdrawBitcoin.bind(this)

    this.state = {
      alerts: []
    }
    this.onValueChange = this.onValueChange.bind(this)
  }

  onValueChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  withdrawBitcoin(event) {
    event.preventDefault()
    // TODO: add user entered password
    decryptPrivateKeychain("password", this.props.account.encryptedBackupPhrase)
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

     const incompleteTransaction = tx.buildIncomplete()
     const byteLength = incompleteTransaction.byteLength()


     getNetworkFee(byteLength).then((fee) => {
       const amountToSend = totalSatoshis - fee

       console.log(`Amount to send to ${recipientAddress}: ${amountToSend} Network fee: ${fee}`)

       // TODO: instead of 0 we should use dust amount
       if(amountToSend <= 0) {
         throw "There isn't enough bitcoin to pay the network fee."
       }

       tx.addOutput(recipientAddress, amountToSend)

       tx.sign(0, key)
       const rawTransaction = tx.build().toHex()
       console.log(rawTransaction)
       broadcastTransaction(rawTransaction)
     })

     }).catch((error) => {
       console.error(error)
     })


    }).catch((error) => {
      console.error(error)
    })
  }

  render() {
    return (
      <div className="body-inner body-inner-white">
        <PageHeader title="Withdraw" />
        <div className="container">
          <div className="row">
            <div className="col-md-3">
              <AccountSidebar activeTab="withdraw" />
            </div>
            <div className="col-md-9">
              <Balance/>
              <p>Send your funds to another Bitcoin wallet.</p>
              <InputGroup data={this.state} onChange={this.onValueChange} name="recipientAddress" label="Recipient address" placeholder="Recipient address" />
              <div>
                <button className="btn btn-primary" onClick={this.withdrawBitcoin}>Send</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WithdrawPage)
