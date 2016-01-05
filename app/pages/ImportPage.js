import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { PublicKeychain } from 'keychain-manager'; delete global._bitcore

import * as KeychainActions from '../actions/keychain'

function mapStateToProps(state) {
  return {
    identityAccount: state.keychain.identityAccounts[0]
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(KeychainActions, dispatch)
}

class ImportPage extends Component {
  static propTypes = {
    identityAccount: PropTypes.object.isRequired,
    newIdentityAddress: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.refreshAddress = this.refreshAddress.bind(this)
  }

  refreshAddress(event) {
    this.props.newIdentityAddress()
  }

  render() {
    const accountKeychain = new PublicKeychain(this.props.identityAccount.accountKeychain),
          addressIndex = this.props.identityAccount.addressIndex,
          currentAddress = accountKeychain.child(addressIndex).address().toString()

    return (
      <div>
        <div>
          <h3>Import Identity</h3>

          <p>Send the identity to the following address:</p>

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

export default connect(mapStateToProps, mapDispatchToProps)(ImportPage)
