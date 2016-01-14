import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { PublicKeychain } from 'keychain-manager'; delete global._bitcore

import * as KeychainActions from '../actions/keychain'

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

    return (
      <div>
        <div>
          <h3>Deposit Bitcoins</h3>

          <p><i>
            Note: every identity registration costs a certain amount of money and must be paid for by funds in your account.
          </i></p>

          <p>To top up your account, send bitcoins to the address below:</p>

          <div className="highlight">
            <pre>
              <code>{currentAddress}</code>
            </pre>
          </div>

          <div>
            <button className="btn btn-secondary" onClick={this.refreshAddress}>
              New Address
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DepositPage)

