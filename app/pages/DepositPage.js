import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { PublicKeychain } from 'keychain-manager'

import { KeychainActions } from '../store/keychain'

function mapStateToProps(state) {
  return {
    accountKeychain: state.keychain.bitcoinAccounts[0].accountKeychain,
    addressIndex: state.keychain.bitcoinAccounts[0].addressIndex
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(KeychainActions, dispatch)
}

class DepositPage extends Component {
  static propTypes = {
    accountKeychain: PropTypes.string.isRequired,
    addressIndex: PropTypes.number.isRequired,
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
    const accountKeychain = new PublicKeychain(this.props.accountKeychain),
          addressIndex = this.props.addressIndex,
          currentAddress = accountKeychain.child(addressIndex).address().toString()

    return (
      <div>
        <h2>Deposit</h2>
        <p><i>
          Note: All identity registrations require funds from your account.
          To fund your account, send bitcoins to the address below.
        </i></p>

        <h5>Send Bitcoins to this address</h5>
        <div className="highlight">
          <pre>
            <code>{currentAddress}</code>
          </pre>
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