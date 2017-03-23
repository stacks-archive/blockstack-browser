import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import { AccountSidebar, Balance, PageHeader } from '../../components/index'
import { AccountActions }                      from '../../store/account'

import { authorizationHeaderValue } from '../../utils'

function mapStateToProps(state) {
  return {
    addresses: state.account.bitcoinAccount.addresses,
    walletPaymentAddressUrl: state.settings.api.walletPaymentAddressUrl
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(AccountActions, dispatch)
}

class DepositPage extends Component {
  static propTypes = {
    addresses: PropTypes.array.isRequired,
    newBitcoinAddress: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      coreWalletAddress: null
    }

    this.loadAddress = this.loadAddress.bind(this)
  }

  componentWillMount() {
    this.loadAddress()
  }

  componentWillReceiveProps() {
    this.loadAddress()
  }

  loadAddress() {
    const url = this.props.walletPaymentAddressUrl
    const headers = {"Authorization": authorizationHeaderValue() }
    fetch(url, { headers: headers })
    .then((response) => response.text())
    .then((responseText) => JSON.parse(responseText))
    .then((responseJson) => {
      const address = responseJson.address
      this.setState({
        coreWalletAddress: address
      })
    })    
  }

  render() {
    return (
      <div>
        <Balance />
        <p><i>
          Note: All identity registrations require funds from your account.
          To fund your account, send bitcoins to the address below.
        </i></p>

        { this.state.coreWalletAddress ?
        <div>
          <h5>Send Bitcoins to this address</h5>
          <div className="highlight">
            <pre>
              <code>{this.state.coreWalletAddress}</code>
            </pre>
          </div>
        </div>
        :
        <div>
          <h5>Loading address...</h5>
        </div>
        }
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DepositPage)