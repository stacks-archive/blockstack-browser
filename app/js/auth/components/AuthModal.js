import React, { Component, PropTypes } from 'react'
import Modal from 'react-modal'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { AuthActions } from '../store/auth'
import { Link } from 'react-router'
import { decodeToken } from 'jsontokens'
import {
  makeAuthResponse, getAuthRequestFromURL, Person, redirectUserToApp
} from 'blockstack'
import Image from '../../components/Image'
import { AppsNode } from '../../utils/account-utils'
import { setCoreStorageConfig } from '../../utils/api-utils'
import { isCoreEndpointDisabled, isWindowsBuild } from '../../utils/window-utils'
import { getTokenFileUrlFromZoneFile } from '../../utils/zone-utils'
import { HDNode } from 'bitcoinjs-lib'
import { validateScopes } from '../utils'
import ToolTip from '../../components/ToolTip'
import log4js from 'log4js'

const logger = log4js.getLogger('auth/components/AuthModal.js')

const APP_EMAIL_SCOPE_WHITELIST = [
  'https://staging.blockstack.clients.barefootcoders.com',
  'https://blockstack.com',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:3003',
  'http://localhost:4000',
  'http://localhost:5000',
  'http://localhost:8080'
]

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
    api: state.settings.api,
    email: state.account.email
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
    appManifestLoading: PropTypes.bool,
    email: PropTypes.string,
    noCoreSessionToken: PropTypes.func.isRequired
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
      invalidScopes: false,
      sendEmail: false,
      blockchainId: null,
      noStorage: false,
      responseSent: false,
      scopes: {
        email: false,
        appIndex: false
      },
    }

    this.login = this.login.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }

  componentWillMount() {
    const authRequest = getAuthRequestFromURL()
    const decodedToken = decodeToken(authRequest)

    const appDomain = decodedToken.payload.domain_name
    const scopes = decodedToken.payload.scopes
    let invalidScopes = false

    if (scopes.includes('email')
    && !APP_EMAIL_SCOPE_WHITELIST.includes(appDomain)) {
      logger.error(`componentWillMount: ${appDomain} not in 'email' scope whitelist`)
      invalidScopes = true
    }

    if (scopes.includes('email')) {
      this.setState({
        scopes: {
          email: true
        }
      })
    }

    if (scopes.includes('appIndex')) {
      this.setState({
        scopes: {
          appIndex: true
        }
      })
    }

    console.log(scopes)

    this.setState({
      authRequest,
      decodedToken,
      invalidScopes
    })

    this.props.loadAppManifest(authRequest)
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.responseSent) {
      const storageConnected = this.props.api.storageConnected
      this.setState({
        storageConnected
      })

      const appDomain = this.state.decodedToken.payload.domain_name
      const localIdentities = nextProps.localIdentities
      const identityKeypairs = nextProps.identityKeypairs
      if ((!appDomain || !nextProps.coreSessionTokens[appDomain])) {
        if (this.state.noStorage) {
          logger.debug('componentWillReceiveProps: no core session token expected')
        } else {
          logger.debug('componentWillReceiveProps: no app domain or no core session token')
          return
        }
      }

      logger.trace('componentWillReceiveProps')

      const coreSessionToken = nextProps.coreSessionTokens[appDomain]
      let decodedCoreSessionToken = null
      if (!this.state.noStorage) {
        logger.debug('componentWillReceiveProps: received coreSessionToken')
        decodedCoreSessionToken = decodeToken(coreSessionToken)
      } else {
        logger.debug('componentWillReceiveProps: received no coreSessionToken')
      }

      const identityIndex = this.state.currentIdentityIndex

      const hasUsername = this.state.hasUsername
      if (hasUsername) {
        logger.debug(`login(): id index ${identityIndex} has no username`)
      }

      // Get keypair corresponding to the current user identity
      const profileSigningKeypair = identityKeypairs[identityIndex]
      const identity = localIdentities[identityIndex]

      let blockchainId = null
      if (decodedCoreSessionToken) {
        blockchainId = decodedCoreSessionToken.payload.blockchain_id
      } else {
        blockchainId = this.state.blockchainId
      }

      const profile = identity.profile
      const privateKey = profileSigningKeypair.key
      const appsNodeKey = profileSigningKeypair.appsNodeKey
      const salt = profileSigningKeypair.salt
      const appsNode = new AppsNode(HDNode.fromBase58(appsNodeKey), salt)
      const appPrivateKey = appsNode.getAppNode(appDomain).getAppPrivateKey()

      const gaiaBucketAddress = nextProps.identityKeypairs[0].address
      const profileUrlBase = `https://gaia.blockstack.org/hub/${gaiaBucketAddress}`
      let profileUrl = `${profileUrlBase}/${identityIndex}/profile.json`

      if (identity.zoneFile && identity.zoneFile.length > 0) {
        const profileUrlFromZonefile = getTokenFileUrlFromZoneFile(identity.zoneFile)
        if (profileUrlFromZonefile !== null && profileUrlFromZonefile !== undefined) {
          profileUrl = profileUrlFromZonefile
        }
      }

      const email = this.props.email
      const sendEmail = this.state.sendEmail

      logger.debug(`profileUrl: ${profileUrl}`)
      logger.debug(`email: ${email}`)

      const metadata = {
        email: sendEmail ? email : null,
        profileUrl
      }

      // TODO: what if the token is expired?
      // TODO: use a semver check -- or pass payload version to
      //        makeAuthResponse
      let authResponse

      let profileResponseData
      if (this.state.decodedToken.payload.do_not_include_profile) {
        profileResponseData = null
      } else {
        profileResponseData = profile
      }

      if (this.state.decodedToken.payload.version === '1.1.0' &&
          this.state.decodedToken.payload.public_keys.length > 0) {
        const transitPublicKey = this.state.decodedToken.payload.public_keys[0]

        authResponse = makeAuthResponse(privateKey, profileResponseData, blockchainId,
                                        metadata,
                                        coreSessionToken, appPrivateKey,
                                        undefined, transitPublicKey)
      } else {
        authResponse = makeAuthResponse(privateKey, profileResponseData, blockchainId,
                                        metadata,
                                        coreSessionToken, appPrivateKey)
      }

      this.props.clearSessionToken(appDomain)

      logger.trace(`login(): id index ${identityIndex} is logging in`)
      this.setState({ responseSent: true })
      redirectUserToApp(this.state.authRequest, authResponse)
    } else {
      logger.error('componentWillReceiveProps: response already sent - doing nothing')
    }
  }

  closeModal() {
    this.context.router.push('/')
  }

  login() {
    this.setState({
      processing: true,
      invalidScopes: false
    })
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
                this.setState({
                  blockchainId: lookupValue
                })
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
          const scopes = this.state.decodedToken.payload.scopes
          const appsNodeKey = profileSigningKeypair.appsNodeKey
          const salt = profileSigningKeypair.salt
          const appsNode = new AppsNode(HDNode.fromBase58(appsNodeKey), salt)
          const appPrivateKey = appsNode.getAppNode(appDomain).getAppPrivateKey()
          const blockchainId = (hasUsername ? identity.username : null)

          const scopesJSONString = JSON.stringify(scopes)

          if (!validateScopes(scopes)) {
            this.setState({
              invalidScopes: true
            })
            logger.error(`login: App requesting unsupported scopes: ${scopesJSONString}`)
            return
          }

          this.setState({
            hasUsername,
            sendEmail: !!scopes.includes('email')
          })
          const requestingStoreWrite = !!scopes.includes('store_write')
          if (requestingStoreWrite) {
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
          } else {
            logger.trace('login(): No storage access requested.')
            this.setState({
              noStorage: true
            })
            this.props.noCoreSessionToken(appDomain)
          }
        })
  }

  render() {
    const appManifest = this.props.appManifest
    const appManifestLoading = this.props.appManifestLoading
    const processing = this.state.processing
    const invalidScopes = this.state.invalidScopes
    const decodedToken = this.state.decodedToken
    const noStorage = (decodedToken
                       && decodedToken.payload.scopes
                       && !decodedToken.payload.scopes.includes('store_write'))

    const coreShortCircuit = (!appManifestLoading
                              && appManifest !== null
                              && !invalidScopes
                              && !noStorage
                              && isCoreEndpointDisabled())
    if (coreShortCircuit) {
      let appText
      if (isWindowsBuild()) {
        appText = 'Windows build'
      } else {
        appText = 'webapp'
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
            <div>
              <p>
               This application requires using Gaia storage, which is not supported yet 
               in our {appText}. Feature coming soon!
              </p>
            </div>
          </Modal>
        </div>
      )
    }

    const scopeEmail = this.state.scopes.email
    const scopeAppIndex = this.state.scopes.appIndex
    const scopeStorage = this.state.scopes.storage
    return (
      <div className="">
        <ToolTip id="scope-basic">
          <div>
            <div>Your basic info includes your Blockstack ID and profile.</div>
          </div>
        </ToolTip>
        <ToolTip id="scope-profile">
          <div>
            <div>The app will add itself to your profile so that other users of the app can discover and interact with you.</div>
          </div>
        </ToolTip>
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
          {appManifest === null || invalidScopes ?
            <div>
              <p>
                 Invalid Sign In Request
              </p>
            </div>
            :
            <div>
            {appManifest.hasOwnProperty('icons') ?
              <p className="m-t-20 m-b-20">
                <Image
                  src={appManifest.icons[0].src}
                  style={{ width: '128px', height: '128px' }}
                  fallbackSrc="/images/app-icon-hello-blockstack.png"
                />
              </p>
            : null}

            <p>The app <strong>"{appManifest.name}"</strong> wants to</p>
            <div>
              <strong>Read your basic info</strong>
              <span data-tip data-for="scope-basic"><i className="fa fa-info-circle" /></span>
            </div>
            {scopeEmail ? 
              <div>
                <strong>Read your email address</strong>
              </div> : null}
            {scopeAppIndex ? 
              <div>
                <strong>Add itself to your profile</strong>
                <span data-tip data-for="scope-profile"><i className="fa fa-info-circle" /></span>
              </div> : null}

            {this.props.localIdentities.length > 0 ?
              <div className="m-t-20">
              {this.state.storageConnected ?
                <div>
                  <p>Choose a Blockstack ID to sign in with.</p>
                  <select
                    className="form-control profile-select"
                    onChange={
                      (event) => this.setState({
                        currentIdentityIndex: event.target.value
                      })}
                    value={this.state.currentIdentityIndex ? this.state.currentIdentityIndex : 0}
                    disabled={processing}
                  >
                    {this.props.localIdentities.map((identity, identityIndex) => {
                      const profile = new Person(identity.profile)
                      const displayLabel = profile.name() ?
                      `${profile.name()}: ID-${identity.ownerAddress}` :
                      `ID-${identity.ownerAddress}`
                      return (<option
                        key={identityIndex}
                        value={identityIndex}
                      >
                        {identity.username ? identity.username : displayLabel}
                      </option>
                    ) })}
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
                <div className="m-t-20">
                  <p>
                    You need to <Link to="/">
                    set up Blockstack</Link> in order to sign in.
                  </p>
                </div>
            }
              </div>
            :
              <div className="m-t-20">
                <p>
                  You need to <Link to="/">
                  set up Blockstack</Link> in order to sign in.
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
