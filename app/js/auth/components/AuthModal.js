import React, { Component, PropTypes } from 'react'
import Modal from 'react-modal'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { AuthActions } from '../store/auth'
import { Link } from 'react-router'
import { decodeToken } from 'jsontokens'
import {
  makeAuthResponse, getAuthRequestFromURL, redirectUserToApp
} from 'blockstack'
import Image from '../../components/Image'
import { AppsNode } from '../../utils/account-utils'
import { setCoreStorageConfig } from '../../utils/api-utils'
import { isWindowsBuild } from '../../utils/window-utils'
import { HDNode } from 'bitcoinjs-lib'
import log4js from 'log4js'

const logger = log4js.getLogger('auth/components/AuthModal.js')

function mapStateToProps(state) {
  return {
    localIdentities: state.profiles.identity.localIdentities,
    defaultIdentity: state.profiles.identity.default,
    identityKeypairs: state.account.identityAccount.keypairs,
    appManifest: state.auth.appManifest,
    appManifestLoading: state.auth.appManifestLoading,
    appManifestLoadingError: state.auth.appManifestLoadingError,
    coreSessionTokens: state.auth.coreSessionTokens,
    coreHost: state.settings.api.coreHost,
    corePort: state.settings.api.corePort,
    coreAPIPassword: state.settings.api.coreAPIPassword,
    api: state.settings.api
  }
}

function mapDispatchToProps(dispatch) {
  const actions = Object.assign({}, AuthActions)
  return bindActionCreators(actions, dispatch)
}

class AuthModal extends Component {
  static contextTypes = {
    router: PropTypes.object
  }
  static propTypes = {
    defaultIdentity: PropTypes.number.isRequired,
    localIdentities: PropTypes.array.isRequired,
    loadAppManifest: PropTypes.func.isRequired,
    clearSessionToken: PropTypes.func.isRequired,
    getCoreSessionToken: PropTypes.func.isRequired,
    coreAPIPassword: PropTypes.string.isRequired,
    coreSessionTokens: PropTypes.object.isRequired,
    loginToApp: PropTypes.func.isRequired,
    api: PropTypes.object.isRequired,
    identityKeypairs: PropTypes.array.isRequired,
    coreHost: PropTypes.string.isRequired,
    corePort: PropTypes.number.isRequired,
    appManifest: PropTypes.object,
    appManifestLoading: PropTypes.bool
  }

  constructor(props) {
    super(props)

    this.state = {
      currentIdentityIndex: this.props.defaultIdentity,
      authRequest: null,
      appManifest: null,
      coreSessionToken: null,
      decodedToken: null,
      storageConnected: this.props.api.storageConnected,
      processing: false,
      windowsBuild: isWindowsBuild()
    }

    this.login = this.login.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }

  componentWillMount() {
    const authRequest = getAuthRequestFromURL()
    const decodedToken = decodeToken(authRequest)
    this.setState({
      authRequest,
      decodedToken
    })

    this.props.loadAppManifest(authRequest)
  }

  componentWillReceiveProps(nextProps) {
    const storageConnected = this.props.api.storageConnected
    this.setState({
      storageConnected
    })

    const appDomain = this.state.decodedToken.payload.domain_name
    const localIdentities = nextProps.localIdentities
    const identityKeypairs = nextProps.identityKeypairs
    if (!appDomain || !nextProps.coreSessionTokens[appDomain]) {
      logger.debug('componentWillReceiveProps: no app domain or no core session token')
      return
    }

    logger.trace('componentWillReceiveProps: received coreSessionToken')
    const coreSessionToken = nextProps.coreSessionTokens[appDomain]
    const decodedCoreSessionToken = decodeToken(coreSessionToken)

    const identityIndex = this.state.currentIdentityIndex

    const hasUsername = this.state.hasUsername
    if (hasUsername) {
      logger.debug(`login(): id index ${identityIndex} has no username`)
    }

    // Get keypair corresponding to the current user identity
    const profileSigningKeypair = identityKeypairs[identityIndex]

    const blockchainId = decodedCoreSessionToken.payload.blockchain_id
    const identity = localIdentities[identityIndex]
    const profile = identity.profile
    const privateKey = profileSigningKeypair.key
    const appsNodeKey = profileSigningKeypair.appsNodeKey
    const salt = profileSigningKeypair.salt
    const appsNode = new AppsNode(HDNode.fromBase58(appsNodeKey), salt)
    const appPrivateKey = appsNode.getAppNode(appDomain).getAppPrivateKey()

    // TODO: what if the token is expired?
    const authResponse = makeAuthResponse(privateKey, profile, blockchainId,
        coreSessionToken, appPrivateKey)

    this.props.clearSessionToken(appDomain)

    logger.trace(`login(): id index ${identityIndex} is logging in`)
    redirectUserToApp(this.state.authRequest, authResponse)
  }

  closeModal() {
    this.context.router.push('/')
  }

  login() {
    this.setState({ processing: true })
    this.props.loginToApp()
    const localIdentities = this.props.localIdentities
    const identityIndex = this.state.currentIdentityIndex
    const identity = localIdentities[identityIndex]
    let hasUsername = true
    if (!identity.username || identity.usernamePending) {
      logger.debug(`login(): the id ${identity.ownerAddress} has no username`)
      hasUsername = false
    }

    // check to see if username is resolvable until we get name state managament
    // fixed in
    // https://github.com/blockstack/blockstack-browser/issues/864#issuecomment-335035037


    const lookupValue = hasUsername ? identity.username : ''


    // if profile has no name, lookupUrl will be
    // http://localhost:6270/v1/names/ which returns 401
    const lookupUrl = this.props.api.nameLookupUrl.replace('{name}', lookupValue)
    fetch(lookupUrl)
        .then(response => response.text())
        .then(responseText => JSON.parse(responseText))
        .then(responseJSON => {
          if (hasUsername) {
            if (responseJSON.hasOwnProperty('address')) {
              const nameOwningAddress = responseJSON.address
              if (nameOwningAddress === identity.ownerAddress) {
                logger.debug('login: name has propagated on the network.')
              } else {
                logger.debug('login: name is not usable on the network.')
                hasUsername = false
              }
            } else {
              logger.debug('login: name is not visible on the network.')
              hasUsername = false
            }
          }

          // Get keypair corresponding to the current user identity
          const profileSigningKeypair = this.props.identityKeypairs
          .find((keypair) => keypair.address === identity.ownerAddress)

          const appDomain = this.state.decodedToken.payload.domain_name
          const appsNodeKey = profileSigningKeypair.appsNodeKey
          const salt = profileSigningKeypair.salt
          const appsNode = new AppsNode(HDNode.fromBase58(appsNodeKey), salt)
          const appPrivateKey = appsNode.getAppNode(appDomain).getAppPrivateKey()
          const blockchainId = (hasUsername ? identity.username : null)
          this.setState({ hasUsername })
          logger.trace('login(): Calling setCoreStorageConfig()...')
          setCoreStorageConfig(this.props.api, identityIndex, identity.ownerAddress,
          identity.profile, profileSigningKeypair)
          .then(() => {
            logger.trace('login(): Core storage successfully configured.')
            logger.trace('login(): Calling getCoreSessionToken()...')
            this.props.getCoreSessionToken(this.props.coreHost,
                this.props.corePort, this.props.coreAPIPassword, appPrivateKey,
                appDomain, this.state.authRequest, blockchainId)
          })
        })
  }

  render() {
    const appManifest = this.props.appManifest
    const appManifestLoading = this.props.appManifestLoading
    const processing = this.state.processing
    if (isWindowsBuild()) {
      return (
        <div className="">
        <Modal
          isOpen
          onRequestClose={this.closeModal}
          contentLabel="This is My Modal"
          shouldCloseOnOverlayClick
          style={{ overlay: { zIndex: 10 } }}
          className="container-fluid"
          portalClassName="auth-modal"
        >
          <h3>Sign In Request</h3>
            <div>
              <p>
                 Authenticating with applications is not supported yet in our Windows build. Feature coming soon!
              </p>
            </div>
        </Modal>
        </div>
      )
    }

    return (
      <div className="">
        <Modal
          isOpen
          onRequestClose={this.closeModal}
          contentLabel="This is My Modal"
          shouldCloseOnOverlayClick
          style={{ overlay: { zIndex: 10 } }}
          className="container-fluid"
          portalClassName="auth-modal"
        >
          <h3>Sign In Request</h3>
          {appManifestLoading ?
            <div>
              <p>
                 Loading app details...
              </p>
            </div>
            :
            <div>
          {appManifest === null ?
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
            {appManifest.hasOwnProperty('icons') ?
              <p>
                <Image
                  src={appManifest.icons[0].src}
                  style={{ width: '128px', height: '128px' }}
                  fallbackSrc="/images/app-icon-hello-blockstack.png"
                />
              </p>
            : null}
            {this.props.localIdentities.length > 0 ?
              <div>
              {this.state.storageConnected ?
                <div>
                  <p>Choose a profile to log in with.</p>
                  <select
                    className="form-control profile-select"
                    onChange={
                      (event) => this.setState({
                        currentIdentityIndex: event.target.value
                      })}
                    value={this.state.currentIdentityIndex ? this.state.currentIdentityIndex : 0}
                    disabled={processing}
                  >
                    {this.props.localIdentities.map((identity, identityIndex) => (
                      <option
                        key={identityIndex}
                        value={identityIndex}
                      >
                        {identity.username ? identity.username : identity.ownerAddress}
                      </option>
                    ))}
                  </select>
                  <div>
                    <button
                      className="btn btn-primary btn-block"
                      onClick={this.login}
                      disabled={processing}
                    >
                      {processing ? 'Signing in...' : 'Approve'}
                    </button>
                    {processing ?
                      <a href="/" className="btn btn-outline-primary btn-block">
                        Cancel
                      </a>
                    :
                      <Link to="/" className="btn btn-outline-primary btn-block">
                        Deny
                      </Link>
                  }
                  </div>
                </div>
            :
                <div>
                  <p>
                    You need to
                    <Link to="/account/storage">connect your storage</Link>
                    in order to log in.
                  </p>
                </div>
            }
              </div>
            :
              <div>
                <p>
                  You need to <Link to="/profiles">create a Blockstack ID</Link> in order to log in.
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
