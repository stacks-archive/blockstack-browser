import React, { Component, PropTypes } from 'react'
import Modal from 'react-modal'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import queryString from 'query-string'
import base64url from 'base64url'
import { decodeToken } from 'jsontokens'
import Image from './Image'
import { makeAuthResponse } from 'blockstack'

function mapStateToProps(state) {
  return {
    localIdentities: state.identities.localIdentities,
    identityKeypairs: state.account.identityAccount.keypairs
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch)
}

const BLOCKSTACK_HANDLER = "blockstack"

class AuthModal extends Component {
  static propTypes = {
  }

  constructor(props) {
    super(props)

    let appURI = null
    let appName = null
    let appIcon = null

    const queryDict = queryString.parse(location.search)
    if (queryDict.authRequest) {
      const encodedAuthRequest = queryDict.authRequest.split(BLOCKSTACK_HANDLER + ":").join("")
      const authRequest = decodeToken(encodedAuthRequest)
      const manifest = authRequest.payload.appManifest
      appURI = manifest.start_url
      appName = manifest.name
      appIcon = manifest.icons[0].src
    }

    this.state = {
      appURI: appURI,
      appName: appName,
      appIcon: appIcon
    }

    this.login = this.login.bind(this)
  }

  login() {
    if (Object.keys(this.props.localIdentities).length > 0) {
      const userDomainName = Object.keys(this.props.localIdentities)[0]
      const identity = this.props.localIdentities[userDomainName]
      const profile = identity.profile

      const privateKey = this.props.identityKeypairs[0].key
      const authResponseToken = makeAuthResponse(privateKey, profile, userDomainName)
      window.location = this.state.appURI + '?authResponse=' + authResponseToken
    }
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
          <h3>Sign In Request</h3>
          <p>
            The app "{this.state.appName}" wants to access your basic info
          </p>
          <p>
            <Image src={this.state.appIcon} style={{ width: '128px', height: '128px' }}
              fallbackSrc="https://raw.githubusercontent.com/blockstack/blockstack-portal/master/app/images/app-hello-blockstack.png" />
          </p>
          { Object.keys(this.props.localIdentities).length > 0 ?
          <div>
            <p>
              Click below to log in.
            </p>
            <div>
              <button className="btn btn-primary btn-block" onClick={this.login}>
                Approve
              </button>
              <Link to="/" className="btn btn-outline-primary btn-block">
                Deny
              </Link>
            </div>
          </div>
          :
          <div>
            <p>
              You must have created a profile in order to log in.
            </p>
          </div>
          }
        </Modal>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthModal)
