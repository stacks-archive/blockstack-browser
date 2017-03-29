import React, { Component, PropTypes } from 'react'
import Modal from 'react-modal'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import queryString from 'query-string'
import { decodeToken } from 'jsontokens'
import Image from './Image'
import {
  makeAuthResponse, getAuthRequestFromURL, fetchAppManifest, redirectUserToApp
} from 'blockstack'

import { AuthActions } from '../store/account'

function mapStateToProps(state) {
  return {
    localIdentities: state.identities.localIdentities,
    identityKeypairs: state.account.identityAccount.keypairs,
    coreSessionToken: state.account.coreSessionToken,
    coreHost: state.settings.api.coreHost,
    corePort: state.settings.api.corePort
  }
}

function mapDispatchToProps(dispatch) {
  let actions = Object.assign({}, AuthActions);
  return bindActionCreators(actions, dispatch)
}

class AuthModal extends Component {
  static contextTypes = {
    router: PropTypes.object
  }
  static propTypes = {
     getCoreSessionToken: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      authRequest: null,
      appManifest: null,
      coreSessionToken: null,
    }

    this.login = this.login.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }

  componentWillMount() {
    const authRequest = getAuthRequestFromURL()
    fetchAppManifest(authRequest).then(appManifest => {
      this.setState({
        authRequest: authRequest,
        appManifest: appManifest
      })
    }).catch((e) => {
      console.log(e.stack)
    })
  }

  componentWillReceiveProps(nextProps) {
    if( nextProps.coreSessionToken ) {
       this.setState({
          coreSessionToken: nextProps.coreSessionToken
       })
    }
  }

  closeModal() {
    this.context.router.push('/')
  }

  login() {
    if (Object.keys(this.props.localIdentities).length > 0) {
      const userDomainName = Object.keys(this.props.localIdentities)[0]
      const identity = this.props.localIdentities[userDomainName]
      const profile = identity.profile
      const privateKey = this.props.identityKeypairs[0].key

      console.log("core session: " + this.coreSessionToken)
      if( this.props.coreSessionToken ) {
          // got core token already.
          // TODO: what if the token is expired?
          const authResponse = makeAuthResponse(privateKey, profile, userDomainName, this.coreSessionToken)
          redirectUserToApp(this.state.authRequest, authResponse)
      }
      else {
          // go get it 
          this.props.getCoreSessionToken(this.props.coreHost, this.props.corePort, privateKey, userDomainName)
      }
    }
  }

  render() {
    const appManifest = this.state.appManifest

    return (
      <div className="">
        <Modal
          isOpen={true}
          onRequestClose={this.closeModal}
          contentLabel="This is My Modal"
          shouldCloseOnOverlayClick={true}
          style={{overlay: {zIndex: 10}}}
          className="container-fluid">
          <h3>Sign In Request</h3>
          { appManifest ?
          <div>
            <p>
              The app "{appManifest.name}" wants to access your basic info
            </p>
            { appManifest.hasOwnProperty('icons') ?
            <p>
              <Image src={appManifest.icons[0].src} style={{ width: '128px', height: '128px' }}
                fallbackSrc="/images/app-icon-hello-blockstack.png" />
            </p>
            : null }
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
          </div>
          : null }
        </Modal>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthModal)
