import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import { AccountSidebar, Balance, PageHeader } from '../../components/index'
import { AccountActions }                      from '../../store/account'

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
    this.refreshAddress = this.refreshAddress.bind(this)
    this.state = {
      coreWalletAddress: ''
    }
  }

  componentWillMount() {
    fetch(this.props.walletPaymentAddressUrl)
    .then((response) => response.text())
    .then((responseText) => JSON.parse(responseText))
    .then((responseJson) => {
      const address = responseJson.address
      this.setState({coreWalletAddress: address})
    })
  }

  refreshAddress(event) {
    //this.props.newBitcoinAddress()
  }

  render() {
    return (
      <div className="body-inner-white">
        <PageHeader title="Deposit" />
        <div className="container vertical-split-content">
          <div className="row">
            <div className="col-md-3">
              <AccountSidebar activeTab="deposit" />
            </div>
            <div className="col-md-9">
              <Balance />
              <p><i>
                Note: All identity registrations require funds from your account.
                To fund your account, send bitcoins to the address below.
              </i></p>

              <h5>Send Bitcoins to this address</h5>
              <div className="highlight">
                <pre>
                  <code>{this.state.coreWalletAddress}</code>
                </pre>
              </div>
            </div>
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
