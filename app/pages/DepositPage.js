import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { PublicKeychain } from 'keychain-manager'; delete global._bitcore

import { KeychainActions } from '../store/keychain'

function mapStateToProps(state) {
  return {
    bitcoinAccount: state.keychain.bitcoinAccounts[0]
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(KeychainActions, dispatch)
}

class DepositPage extends Component {
  static propTypes = {
    bitcoinAccount: PropTypes.object.isRequired,
    newBitcoinAddress: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.refreshAddress = this.refreshAddress.bind(this)
  }

  refreshAddress(event) {
    this.props.newBitcoinAddress()
  }

  render() {
    const accountKeychain = new PublicKeychain(this.props.bitcoinAccount.accountKeychain),
          addressIndex = this.props.bitcoinAccount.addressIndex,
          currentAddress = accountKeychain.child(addressIndex).address().toString()

    const balance = 0

    return (
      <div>
        <div>
          <h3>Balance:</h3>

          <p><i>
            Note: The balance is displayed in bits. Each bit is 1/1000th of a bitcoin.
          </i></p>

          <div className="highlight">
            <pre>
              <code>{balance} mBTC</code>
            </pre>
          </div>

          <h3>Deposit:</h3>

          <p><i>
            Note: All identity registrations require funds from your account.
            To fund your account, send bitcoins to the address below.
          </i></p>

          <div className="highlight">
            <pre>
              <code>{currentAddress}</code>
            </pre>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DepositPage)

/*
  <div>
    <button className="btn btn-secondary" onClick={this.refreshAddress}>
      New Address
    </button>
  </div>
*/