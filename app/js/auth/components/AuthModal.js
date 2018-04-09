import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Modal from 'react-modal'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { AuthActions } from '../store/auth'
import { Link } from 'react-router'
import { decodeToken } from 'jsontokens'
import {
  makeAuthResponse, getAuthRequestFromURL, Person, redirectUserToApp,
  getAppBucketUrl, isLaterVersion
} from 'blockstack'
import Image from '../../components/Image'
import { AppsNode } from '../../utils/account-utils'
import { setCoreStorageConfig } from '../../utils/api-utils'
import { isCoreEndpointDisabled, isWindowsBuild } from '../../utils/window-utils'
import { getTokenFileUrlFromZoneFile } from '../../utils/zone-utils'
import { HDNode } from 'bitcoinjs-lib'
import { validateScopes, appRequestSupportsDirectHub } from '../utils'
import ToolTip from '../../components/ToolTip'
import log4js from 'log4js'
import { uploadProfile } from '../../account/utils'
import { signProfileForUpload } from '../../utils'

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
    verifyAuthRequestAndLoadManifest: PropTypes.func.isRequired,
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
      noCoreStorage: false,
      responseSent: false,
      scopes: {
        email: false,
        publishData: false
      }
    }

    this.login = this.login.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }

  componentWillMount() {
    const authRequest = getAuthRequestFromURL()
    const decodedToken = decodeToken(authRequest)
    const { scopes } = decodedToken.payload

    this.setState({
      authRequest,
      decodedToken,
      scopes: {
        ...this.state.scopes,
        email: scopes.includes('email'),
        publishData: scopes.includes('publish_data')
      }
    })

    this.props.verifyAuthRequestAndLoadManifest(authRequest)
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
        if (this.state.noCoreStorage) {
          logger.debug('componentWillReceiveProps: no core session token expected')
        } else {
          logger.debug('componentWillReceiveProps: no app domain or no core session token')
          return
        }
      }

      logger.trace('componentWillReceiveProps')

      const coreSessionToken = nextProps.coreSessionTokens[appDomain]
      let decodedCoreSessionToken = null
      if (!this.state.noCoreStorage) {
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

      // Add app storage bucket URL to profile if publish_data scope is requested
      if (this.state.scopes.publishData) {
        let apps = {}
        if (profile.hasOwnProperty('apps')) {
          apps = profile.apps
        }

        if (storageConnected) {
          getAppBucketUrl('https://hub.blockstack.org', appPrivateKey)
          .then((appBucketUrl) => {
            logger.debug(`componentWillReceiveProps: appBucketUrl ${appBucketUrl}`)
            apps[appDomain] = appBucketUrl
            logger.debug(`componentWillReceiveProps: new apps array ${JSON.stringify(apps)}`)
            profile.apps = apps
            const signedProfileTokenData = signProfileForUpload(profile,
            nextProps.identityKeypairs[identityIndex])
            logger.debug('componentWillReceiveProps: uploading updated profile with new apps array')
            return uploadProfile(this.props.api, identity,
              nextProps.identityKeypairs[identityIndex],
              signedProfileTokenData)
          })
          .then(() => {
            this.completeAuthResponse(privateKey, blockchainId, coreSessionToken, appPrivateKey,
              profile, profileUrl)
          })
          .catch((err) => {
            logger.error('componentWillReceiveProps: add app index profile not uploaded', err)
          })
        } else {
          logger.debug('componentWillReceiveProps: storage is not connected. Doing nothing.')
        }
      } else {
        this.completeAuthResponse(privateKey, blockchainId, coreSessionToken, appPrivateKey,
          profile, profileUrl)
      }
    } else {
      logger.error('componentWillReceiveProps: response already sent - doing nothing')
    }
  }

  completeAuthResponse = (privateKey, blockchainId, coreSessionToken,
    appPrivateKey, profile, profileUrl) => {
    const appDomain = this.state.decodedToken.payload.domain_name
    const email = this.props.email
    const sendEmail = this.state.sendEmail

    logger.debug(`profileUrl: ${profileUrl}`)
    logger.debug(`email: ${email}`)


    const metadata = {
      email: sendEmail ? email : null,
      profileUrl
    }

    let profileResponseData
    if (this.state.decodedToken.payload.do_not_include_profile) {
      profileResponseData = null
    } else {
      profileResponseData = profile
    }

    let transitPublicKey = undefined
    let hubUrl = undefined

    let requestVersion = '0'
    if (this.state.decodedToken.payload.hasOwnProperty('version')) {
      requestVersion = this.state.decodedToken.payload.version
    }

    if (isLaterVersion(requestVersion, '1.1.0') &&
        this.state.decodedToken.payload.public_keys.length > 0) {
      transitPublicKey = this.state.decodedToken.payload.public_keys[0]
    }
    if (appRequestSupportsDirectHub(this.state.decodedToken.payload)) {
      hubUrl = this.props.api.gaiaHubConfig.server
    }

    const authResponse = makeAuthResponse(privateKey, profileResponseData, blockchainId,
                                          metadata, coreSessionToken, appPrivateKey,
                                          undefined, transitPublicKey, hubUrl)

    this.props.clearSessionToken(appDomain)

    logger.trace(`login(): id index ${this.state.currentIdentityIndex} is logging in`)
    this.setState({ responseSent: true })
    redirectUserToApp(this.state.authRequest, authResponse)
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
          const needsCoreStorage = !appRequestSupportsDirectHub(this.state.decodedToken.payload)

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
          if (requestingStoreWrite && needsCoreStorage) {
            logger.trace('login(): Calling setCoreStorageConfig()...')
            setCoreStorageConfig(this.props.api, identityIndex, identity.ownerAddress,
            identity.profile, profileSigningKeypair, identity)
            .then(() => {
              logger.trace('login(): Core storage successfully configured.')
              logger.trace('login(): Calling getCoreSessionToken()...')
              this.props.getCoreSessionToken(this.props.coreHost,
                  this.props.corePort, this.props.coreAPIPassword, appPrivateKey,
                  appDomain, this.state.authRequest, blockchainId)
            })
          } else if (requestingStoreWrite && !needsCoreStorage) {
            logger.trace('login(): app can communicate directly with gaiahub, not setting up core.')
            this.setState({
              noCoreStorage: true
            })
            this.props.noCoreSessionToken(appDomain)
          } else {
            logger.trace('login(): No storage access requested.')
            this.setState({
              noCoreStorage: true
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
    const noCoreStorage = (decodedToken
                           && decodedToken.payload.scopes
                           && (!decodedToken.payload.scopes.includes('store_write')
                               || appRequestSupportsDirectHub(decodedToken.payload)))

    const coreShortCircuit = (!appManifestLoading
                              && appManifest !== null
                              && !invalidScopes
                              && !noCoreStorage
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
              {appManifest.hasOwnProperty('icons') ?
                <p>
                  <Image
                    src={appManifest.icons[0].src}
                    style={{ width: '128px', height: '128px' }}
                    fallbackSrc="/images/app-icon-hello-blockstack.png"
                  />
                </p>
              : null}
              <p>
               This application uses an older Gaia storage library, which is not supported
               in our {appText}. Once the application updates its library, you will be
               able to use it.
              </p>
            </div>
          </Modal>
        </div>
      )
    }

    const scopeEmail = this.state.scopes.email
    const scopePublishData = this.state.scopes.publishData
    return (
      <div className="">
        <ToolTip id="scope-basic">
          <div>
            <div>Your basic info includes your Blockstack ID and profile.</div>
          </div>
        </ToolTip>
        <ToolTip id="scope-publish">
          <div>
            <div>The app may publish data so that other users of the app can discover
            and interact with you.
            </div>
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

              <p>The app <strong>"{appManifest.name}"</strong> located at <br />
              {decodedToken.payload.domain_name}<br />
              wants to:</p>
              <div>
                <strong>Read your basic info</strong>
                <span data-tip data-for="scope-basic"><i className="fa fa-info-circle" /></span>
              </div>
              {scopeEmail ?
                <div>
                  <strong>Read your email address</strong>
                </div> : null}
              {scopePublishData ?
                <div>
                  <strong>Publish data stored for this app</strong>
                  <span data-tip data-for="scope-publish"><i className="fa fa-info-circle" /></span>
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
