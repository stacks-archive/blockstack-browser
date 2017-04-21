import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import PageHeader from '../components/PageHeader'
import { AccountActions } from '../account/store/account'

function mapStateToProps(state) {
  return {
    addresses: state.account.identityAccount.addresses
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(AccountActions, dispatch)
}

class ImportPage extends Component {
  static propTypes = {
    addresses: PropTypes.array.isRequired,
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
    return (
      <div className="body-inner body-inner-white">
        <PageHeader title="Import" />
        <div className="container">
          <div className="col-sm-3">
          </div>
          <div className="col-sm-6">
            <h3>Import Identity</h3>
            <p><i>
              To import an identity into this app,
              go to the app that owns the identity,
              then find the export form and enter the transfer code below.
            </i></p>
            <div className="highlight">
              <pre>
                <code>{this.props.addresses[this.props.addresses.length-1]}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ImportPage)

/*
  <div>
    <button className="btn btn-secondary" onClick={this.refreshAddress}>
      New Address
    </button>
  </div>
*/
