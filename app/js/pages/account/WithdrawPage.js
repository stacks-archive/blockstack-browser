import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { PublicKeychain } from 'blockstack-keychains'

import { decryptPrivateKeychain, getMinerFee, getBitcoinPrivateKeychain, getUtxo } from '../../utils'


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

    this.state = {}
  }

  withdrawBitcoin(event) {
    // TODO: add user entered password
    decryptPrivateKeychain("password", this.props.account.encryptedBackupPhrase)
    .then((privateKeychain) => {
     const bitcoinPrivateKeychain = getBitcoinPrivateKeychain(privateKeychain)

     const key = ECPair.fromWIF(bitcoinPrivateKeychain.ecPair.toWIF())
     const address = bitcoinPrivateKeychain.ecPair.getAddress()

     let tx = new TransactionBuilder()
     let totalSatoshis = 0

     getUtxo(address).then((utxo) => {

       for(let i = 0; i++; i < utxo.length) {
         let input = utxo[i]
         tx.addInput(input.txid, input.vout)
         totalSatoshis = totalSatoshis + input.satoshis
       }

     const incompleteTransaction = tx.buildIncomplete()
     const byteLength = incompleteTransaction.byteLength()


     getMinerFee(byteLength).then((fee) => {
       console.log(`Mining fee: ${fee}`)

       if(totalSatoshis <= fee) {
         throw "There isn't enough bitcoin to pay the mining fee."
       }

       // TODO: add user entered output and proper value
       tx.addOutput("12idKQBikRgRuZEbtxXQ4WFYB7Wa3hZzhT", totalSatoshis - fee);

       tx.sign(0, key);

       // TODO: broadcast transaction
       console.log(tx.build().toHex());
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
              <InputGroup label="Recipient address" placeholder="Recipient address" />
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
