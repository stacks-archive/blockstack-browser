import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { AuthResponse, decodeToken } from 'blockstack-auth'
import queryString from 'query-string'
import base64url from 'base64url'

import { PageHeader } from '../components/index'
import { AccountActions } from '../store/account'

function mapStateToProps(state) {
  return {
    addresses: state.account.identityAccount.addresses,
    publicKeychain: state.account.identityAccount.publicKeychain
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(AccountActions, dispatch)
}

class AuthPage extends Component {
  static propTypes = {
    addresses: PropTypes.array.isRequired,
    publicKeychain: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props)
    this.refreshAddress = this.refreshAddress.bind(this)
    this.login = this.login.bind(this)
  }

  refreshAddress(event) {
    this.props.newIdentityAddress()
  }

  login() {
    console.log('here')
    var queryDict = queryString.parse(location.search)
    console.log(queryDict)
    var appURI = null
    if (queryDict.authRequest) {
      var authRequest = base64url.decode(queryDict.authRequest)
      console.log(authRequest)
      appURI = authRequest.appURI
    }
    console.log(appURI)

    var blockstackID = 'ryan.id'
    var privateKey = '278a5de700e29faae8e40e366ec5012b5ec63d36ec77e8a2417154cc1d25383f'
    var authResponse = new AuthResponse(privateKey)
    console.log(authResponse)
    var publicKeychain = 'xpub661MyMwAqRbcFQVrQr4Q4kPjaP4JjWaf39fBVKjPdK6oGBayE46GAmKzo5UDPQdLSM9DufZiP8eauy56XNuHicBySvZp7J5wsyQVpi2axzZ'
    var chainPath = 'bd62885ec3f0e3838043115f4ce25eedd22cc86711803fb0c19601eeef185e39'
    authResponse.setIssuer(blockstackID, publicKeychain, chainPath)
    var authResponseToken = authResponse.sign()
    console.log(authResponseToken)
    //window.location = appURI + '?authResponse=' + authResponseToken
  }

  render() {
    return (
      <div className="body-inner body-inner-white">
        <PageHeader title="Authentication" />
        <div className="container">
          <div className="col-sm-3">
          </div>
          <div className="col-sm-6">
            <h3>Login Request</h3>
            <p><i>
              An app would like your information. Click below to login.
            </i></p>
            <div>
              <button className="btn btn-primary" onClick={this.login}>
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthPage)