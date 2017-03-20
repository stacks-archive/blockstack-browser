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

function mapStateToProps(state) {
  return {
    localIdentities: state.identities.localIdentities,
    identityKeypairs: state.account.identityAccount.keypairs
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
      authRequest: null,
      appManifest: null
    }

    this.login = this.login.bind(this)
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

  login() {
    if (Object.keys(this.props.localIdentities).length > 0) {
      const userDomainName = Object.keys(this.props.localIdentities)[0]
      const identity = this.props.localIdentities[userDomainName]
      const profile = identity.profile
      const privateKey = this.props.identityKeypairs[0].key
      const authResponse = makeAuthResponse(privateKey, profile)
      redirectUserToApp(this.state.authRequest, authResponse)
    }
  }

  render() {
    const appManifest = this.state.appManifest
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
          { this.state.appManifest ?
          <div>
            <p>
              The app "{appManifest.name}" wants to access your basic info
            </p>
            <p>
              <Image src={appManifest.icons[0].src} style={{ width: '128px', height: '128px' }}
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
          </div>
          : null }
        </Modal>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthModal)
