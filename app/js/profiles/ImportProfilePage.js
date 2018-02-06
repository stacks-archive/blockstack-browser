import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import PageHeader from '../components/PageHeader'
import { AccountActions } from '../account/store/account'

function mapStateToProps(state) {
  return {
    addresses: state.account.identityAccount.addresses,
    nextUnusedAddressIndex: state.account.identityAccount.addressIndex
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
      <div className="card-list-container profile-content-wrapper">
        <div>
          <h5 className="h5-landing">Import Name</h5>
        </div>
        <div className="container">
          <div className="col-sm-6">
            <p><i>
              To import a name into this wallet,
              go to the app that owns the name,
              find the export form and enter the transfer code below.
            </i></p>
            <div className="highlight">
              <pre>
                <code>{this.props.addresses[0]}</code>
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
    <button className="btn btn-tertiary" onClick={this.refreshAddress}>
      New Address
    </button>
  </div>
*/