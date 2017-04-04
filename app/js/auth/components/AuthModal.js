import React, { Component, PropTypes } from 'react'
import Modal from 'react-modal'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { AuthActions } from '../../store/auth'
import { Link } from 'react-router'
import queryString from 'query-string'
import { decodeToken } from 'jsontokens'
import {
  makeAuthResponse, getAuthRequestFromURL, fetchAppManifest, redirectUserToApp
} from 'blockstack'

import Image from '../../components/Image'

function mapStateToProps(state) {
  return {
    localIdentities: state.identities.localIdentities,
    identityKeypairs: state.account.identityAccount.keypairs,
    appManifest: state.auth.appManifest,
    appManifestLoading: state.auth.appManifestLoading,
    appManifestLoadingError: state.auth.appManifestLoadingError
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(AuthActions, dispatch)
}

class AuthModal extends Component {
  static contextTypes = {
    router: PropTypes.object
  }

  static propTypes = {
    loadAppManifest: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      authRequest: null,
    }

    this.login = this.login.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }

  componentWillMount() {
    const authRequest = getAuthRequestFromURL()
    this.setState({
        authRequest: authRequest
    })
    this.props.loadAppManifest(authRequest)
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
      const authResponse = makeAuthResponse(privateKey, profile, userDomainName)
      redirectUserToApp(this.state.authRequest, authResponse)
    }
  }

  render() {
    const appManifest = this.props.appManifest
    const appManifestLoading = this.props.appManifestLoading
    const appManifestLoadingError = this.props.appManifestLoadingError

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
          { appManifestLoading ?
            <div>
               <p>
                 Loading app details...
               </p>
             </div>
            :
            <div>
          { appManifest === null ?
            <div>
               <p>
                 Invalid Sign In Request
               </p>
             </div>
            :
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
                You need to <Link to="/profiles/i/register">create a profile</Link> in order to log in.
              </p>
            </div>
            }
          </div>
        }
        </div>
           }
        </Modal>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthModal)
