import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { PublicKeychain } from 'blockstack-keychains'

import { decryptPrivateKeychain, getBitcoinPrivateKeychain } from '../../utils'


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
     bitcoinPrivateKeychain.ecPair.getAddress()
     const key = ECPair.fromWIF(bitcoinPrivateKeychain.ecPair.toWIF())

     let tx = new TransactionBuilder();
     // TODO: retrive and add inputs
     tx.addInput("d18e7106e5492baf8f3929d2d573d27d89277f3825d3836aa86ea1d843b5158b", 1);

     // TODO: add user entered output and proper value
     tx.addOutput("12idKQBikRgRuZEbtxXQ4WFYB7Wa3hZzhT", 149000);
     tx.sign(0, key);

     // TODO: broadcast transaction
     console.log(tx.build().toHex());
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
