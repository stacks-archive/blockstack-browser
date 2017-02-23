import React, { Component, PropTypes } from 'react'
import Modal from 'react-modal'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { AuthResponse, decodeToken } from 'blockstack-auth'
import queryString from 'query-string'
import base64url from 'base64url'

function mapStateToProps(state) {
  return {
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch)
}

class AuthModal extends Component {
  static propTypes = {
  }

  constructor(props) {
    super(props)

    this.state = {
      appName: "Hello, Blockstack",
      blockstackID: "ryan.id",
      privateKey: "278a5de700e29faae8e40e366ec5012b5ec63d36ec77e8a2417154cc1d25383f",
      publicKeychain: "xpub661MyMwAqRbcFQVrQr4Q4kPjaP4JjWaf39fBVKjPdK6oGBayE46GAmKzo5UDPQdLSM9DufZiP8eauy56XNuHicBySvZp7J5wsyQVpi2axzZ",
      chainPath: "bd62885ec3f0e3838043115f4ce25eedd22cc86711803fb0c19601eeef185e39"
    }

    this.login = this.login.bind(this)
  }

  login() {
    const queryDict = queryString.parse(location.search)
    let appURI = null
    if (queryDict.authRequest) {
      const encodedAuthRequest = queryDict.authRequest.split("web+blockstack:").join("")
      const authRequest = JSON.parse(base64url.decode(encodedAuthRequest))
      appURI = authRequest.appURI
    }
    const authResponse = new AuthResponse(this.state.privateKey)
    authResponse.setIssuer(
      this.state.blockstackID, this.state.publicKeychain, this.state.chainPath)
    const authResponseToken = authResponse.sign()
    window.location = appURI + '?authResponse=' + authResponseToken
  }

  render() {
    return (
      <div className="">
        <Modal
          isOpen={true}
          onRequestClose={this.props.closeModal}
          contentLabel="This is My Modal"
          shouldCloseOnOverlayClick={false}
          style={{overlay: {zIndex: 10}}}
          className="container-fluid">
          <h3>Auth Request</h3>
          <p>
            The app "{this.state.appName}" would like to access your basic information.
          </p>
          <p>
            Click below to log in.
          </p>
          <div>
            <Link to="/" className="btn btn-outline-primary btn-block">
              Deny
            </Link>
            <button className="btn btn-primary btn-block" onClick={this.login}>
              Approve
            </button>
          </div>
        </Modal>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthModal)