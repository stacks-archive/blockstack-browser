import React from 'react'
import PropTypes from 'prop-types'
import { ShellParent, AppHomeWrapper } from '@blockstack/ui'
import { Initial, LegacyGaia } from './views'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { randomBytes } from 'crypto'
import { AuthActions } from './store/auth'
import { IdentityActions } from '../profiles/store/identity'
import { AccountActions } from '../account/store/account'
import { decodeToken, TokenSigner } from 'jsontokens'
import { parseZoneFile } from 'zone-file'
import queryString from 'query-string'
import {
  makeAuthResponse,
  getAuthRequestFromURL,
  redirectUserToApp,
  getAppBucketUrl,
  isLaterVersion,
  updateQueryStringParameter,
  getPublicKeyFromPrivate
} from 'blockstack'
import { AppsNode, CollectionsNode } from '@utils/account-utils'
import { 
  processCollectionScopes
} from '@utils/collection-utils'
import {
  fetchProfileLocations,
  getDefaultProfileUrl
} from '@utils/profile-utils'
import { getTokenFileUrlFromZoneFile } from '@utils/zone-utils'
import { HDNode } from 'bitcoinjs-lib'
import log4js from 'log4js'
import { uploadProfile, uploadIdentitySettings } from '../account/utils'
import { signProfileForUpload } from '@utils'
import {
  validateScopes,
  appRequestSupportsDirectHub,
  getCollectionScopes
} from './utils'
import {
  selectApi,
  selectCoreHost,
  selectCorePort,
  selectCoreAPIPassword
} from '@common/store/selectors/settings'
import {
  selectAppManifest,
  selectAppManifestLoading,
  selectAppManifestLoadingError,
  selectCoreSessionTokens
} from '@common/store/selectors/auth'
import {
  selectLocalIdentities,
  selectDefaultIdentity
} from '@common/store/selectors/profiles'

import {
  selectIdentityKeypairs,
  selectEmail,
  selectIdentityAddresses,
  selectIdentitySettings,
  selectPublicKeychain
} from '@common/store/selectors/account'
import { formatAppManifest } from '@common'
import Modal from 'react-modal'
import url from 'url'

const views = [Initial, LegacyGaia]

const logger = log4js.getLogger(__filename)

const VIEWS = {
  AUTH: 0,
  LEGACY_GAIA: 1
}
function mapStateToProps(state) {
  return {
    localIdentities: selectLocalIdentities(state),
    defaultIdentity: selectDefaultIdentity(state),
    identityKeypairs: selectIdentityKeypairs(state),
    identitySettings: selectIdentitySettings(state),
    appManifest: selectAppManifest(state),
    appManifestLoading: selectAppManifestLoading(state),
    appManifestLoadingError: selectAppManifestLoadingError(state),
    coreSessionTokens: selectCoreSessionTokens(state),
    coreHost: selectCoreHost(state),
    corePort: selectCorePort(state),
    coreAPIPassword: selectCoreAPIPassword(state),
    api: selectApi(state),
    email: selectEmail(state),
    addresses: selectIdentityAddresses(state),
    publicKeychain: selectPublicKeychain(state)
  }
}

function mapDispatchToProps(dispatch) {
  const actions = Object.assign({}, AuthActions, IdentityActions, AccountActions)
  return bindActionCreators(actions, dispatch)
}

function makeGaiaAssociationToken(secretKeyHex: string, childPublicKeyHex: string) {
  const LIFETIME_SECONDS = 365 * 24 * 3600
  const signerKeyHex = secretKeyHex.slice(0, 64)
  const compressedPublicKeyHex = getPublicKeyFromPrivate(signerKeyHex)
  const salt = randomBytes(16).toString('hex')
  const payload = { childToAssociate: childPublicKeyHex,
                    iss: compressedPublicKeyHex,
                    exp: LIFETIME_SECONDS + (new Date()/1000),
                    iat: Date.now()/1000,
                    salt }

  const token = new TokenSigner('ES256K', signerKeyHex).sign(payload)
  return token
}

class AuthPage extends React.Component {
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
    identitySettings: PropTypes.array.isRequired,
    refreshIdentitySettings: PropTypes.func.isRequired,
    refreshAllIdentitySettings: PropTypes.func.isRequired,
    setIdentityCollectionSetting: PropTypes.func.isRequired,
    coreHost: PropTypes.string.isRequired,
    corePort: PropTypes.number.isRequired,
    appManifest: PropTypes.object,
    appManifestLoading: PropTypes.bool,
    appManifestLoadingError: PropTypes.string,
    email: PropTypes.string,
    noCoreSessionToken: PropTypes.func.isRequired,
    addresses: PropTypes.array.isRequired,
    publicKeychain: PropTypes.string.isRequired,
    refreshIdentities: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      currentIdentityIndex: this.props.defaultIdentity,
      authRequest: null,
      echoRequestId: null,
      appManifest: null,
      coreSessionToken: null,
      decodedToken: null,
      storageConnected: this.props.api.storageConnected,
      processing: false,
      refreshingIdentities: true,
      identitySettingsChanged: false,
      invalidScopes: false,
      sendEmail: false,
      blockchainId: null,
      noCoreStorage: false,
      responseSent: false,
      scopes: {
        email: false,
        publishData: false
      },
      view: VIEWS.AUTH
    }

    this.login = this.login.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }

  componentWillMount() {
    const queryDict = queryString.parse(location.search)
    const echoRequestId = queryDict.echo

    const authRequest = getAuthRequestFromURL()
    const decodedToken = decodeToken(authRequest)
    const { scopes } = decodedToken.payload

    this.setState({
      authRequest,
      echoRequestId,
      decodedToken,
      scopes: {
        ...this.state.scopes,
        email: scopes.includes('email'),
        publishData: scopes.includes('publish_data')
      },
      collectionScopes: [
        ...getCollectionScopes(scopes)
      ]
    })

    this.props.verifyAuthRequestAndLoadManifest(authRequest)

    this.getFreshIdentities()
  }

  redirectUserToEchoReply() {
    let redirectURI = this.state.decodedToken.payload.redirect_uri
    if (redirectURI) {
      // Get the current localhost authentication url that the app will redirect back to,
      // and remove the 'echo' param from it.
      const authContinuationURI = updateQueryStringParameter(
        window.location.href,
        'echo',
        ''
      )
      redirectURI = updateQueryStringParameter(
        redirectURI,
        'echoReply',
        this.state.echoRequestId
      )
      redirectURI = updateQueryStringParameter(
        redirectURI,
        'authContinuation',
        encodeURIComponent(authContinuationURI)
      )
    } else {
      throw new Error('Invalid redirect echo reply URI')
    }
    this.setState({ responseSent: true })
    window.location = redirectURI
  }

  componentWillReceiveProps() {
    if (!this.state.responseSent) {
      if (this.state.echoRequestId) {
        this.redirectUserToEchoReply()
        return
      }
    } else {
      logger.error(
        'componentWillReceiveProps: response already sent - doing nothing'
      )
    }
  }

  sendAuthResponse = () => {
    const storageConnected = this.props.api.storageConnected
    const appDomain = this.state.decodedToken.payload.domain_name
    const localIdentities = this.props.localIdentities
    const identityKeypairs = this.props.identityKeypairs
    if (!appDomain) {
      logger.debug(
        'sendAuthResponse(): no app domain'
      )
    }

    const identityIndex = this.state.currentIdentityIndex

    const hasUsername = this.state.hasUsername
    if (hasUsername) {
      logger.debug(`sendAuthResponse()(): id index ${identityIndex} has no username`)
    }

    // // Get keypair corresponding to the current user identity
    const profileSigningKeypair = identityKeypairs[identityIndex]
    const identity = localIdentities[identityIndex]

    const blockchainId = this.state.blockchainId

    const profile = identity.profile
    const privateKey = profileSigningKeypair.key
    const appsNodeKey = profileSigningKeypair.appsNodeKey
    const collectionsNodeKey = profileSigningKeypair.collectionsNodeKey
    const salt = profileSigningKeypair.salt
    const appsNode = new AppsNode(HDNode.fromBase58(appsNodeKey), salt)
    const appPrivateKey = appsNode.getAppNode(appDomain).getAppPrivateKey()
    const collectionsNode = new CollectionsNode(HDNode.fromBase58(collectionsNodeKey), salt)

    let profileUrlPromise

    if (identity.zoneFile && identity.zoneFile.length > 0) {
      const zoneFileJson = parseZoneFile(identity.zoneFile)
      const profileUrlFromZonefile = getTokenFileUrlFromZoneFile(zoneFileJson)
      if (
        profileUrlFromZonefile !== null &&
        profileUrlFromZonefile !== undefined
      ) {
        profileUrlPromise = Promise.resolve(profileUrlFromZonefile)
      }
    }

    const gaiaBucketAddress = this.props.identityKeypairs[0].address
    const identityAddress = this.props.identityKeypairs[identityIndex].address
    const gaiaUrlBase = this.props.api.gaiaHubConfig.url_prefix

    if (!profileUrlPromise) {
      // use default Gaia hub if we can't tell from the profile where the profile Gaia hub is
      profileUrlPromise = fetchProfileLocations(
        gaiaUrlBase,
        identityAddress,
        gaiaBucketAddress,
        identityIndex
      ).then(fetchProfileResp => {
        if (fetchProfileResp && fetchProfileResp.profileUrl) {
          return fetchProfileResp.profileUrl
        } else {
          return getDefaultProfileUrl(gaiaUrlBase, identityAddress)
        }
      })
    }

    profileUrlPromise.then(profileUrl => {
      // Add app storage bucket URL to profile if publish_data scope is requested
      if (this.state.scopes.publishData) {
        if (storageConnected) {
          const identityKeyPair = this.props.identityKeypairs[identityIndex]
          return this.handlePublishDataScope(
            this.props.api,
            profileUrl, 
            profile, 
            this.props.api.gaiaHubUrl, 
            identity,
            identityKeyPair,
            appDomain, 
            appPrivateKey
          )
        } else {
          logger.debug(
            'sendAuthResponse(): storage is not connected. Doing nothing.'
          )
          return false
        }
      } else {
        return profileUrl
      }
    }).then((profileUrl) => 
      // Refresh selected account's identity settings
      this.props.refreshIdentitySettings(
        this.props.api,
        identityIndex,
        this.props.addresses[identityIndex],
        this.props.identityKeypairs[identityIndex]
      ).then(() => 
        // Generate and write collection Gaia hub config and encryption keys
        // to app storage bucket before sending auth response
        processCollectionScopes(
          appPrivateKey, 
          this.state.collectionScopes, 
          collectionsNode, 
          this.props.api.gaiaHubConfig,
          this.props.identitySettings[identityIndex],
          this.updateIdentityCollectionSettings
        )
      ).then(() => {
        if (this.state.identitySettingsChanged) {
          // Upload identity settings if modified
          this.uploadIdentitySettings()
        }
        return profileUrl 
      })
    ).then((profileUrl) => {
      // Generate and send the auth response
      const authResponse = this.generateAuthResponse(
        privateKey,
        blockchainId,
        appPrivateKey,
        profile,
        profileUrl
      )

      logger.info(
        `sendAuthResponse(): id index ${this.state.currentIdentityIndex} is logging in`
      )
        
      this.setState({ responseSent: true })
      redirectUserToApp(this.state.authRequest, authResponse)
    })
  }

  updateIdentityCollectionSettings = (collectionName, settings) => {
    this.setState({
      identitySettingsChanged: true
    })
    const identityIndex = this.state.currentIdentityIndex
    return this.props.setIdentityCollectionSetting(identityIndex, collectionName, settings)
  }

  uploadIdentitySettings = () => {
    const identityIndex = this.state.currentIdentityIndex
    const identitySigner = this.props.identityKeypairs[identityIndex]
    const newIdentitySettings = this.props.identitySettings[identityIndex]

    // TODO: Make identity settings and profile upload more resistant to corruption/loss
    return uploadIdentitySettings(
      this.props.api,
      identitySigner,
      JSON.stringify(newIdentitySettings)
    )
  }

  getFreshIdentities = async () => {
    await this.props.refreshIdentities(this.props.api, this.props.addresses)
    await this.props.refreshAllIdentitySettings(
      this.props.api,
      this.props.addresses,
      this.props.identityKeypairs
    )
    this.setState({ refreshingIdentities: false })
  }

  handlePublishDataScope = (
    api, 
    profileUrl, 
    profile, 
    gaiaHubUrl, 
    identity,
    identityKeyPair, 
    appDomain, 
    appPrivateKey
  ) => {
    let apps = {}
    if (profile.hasOwnProperty('apps')) {
      apps = profile.apps
    }

    return getAppBucketUrl(gaiaHubUrl, appPrivateKey)
      .then(appBucketUrl => {
        logger.debug(
          `componentWillReceiveProps: appBucketUrl ${appBucketUrl}`
        )
        apps[appDomain] = appBucketUrl
        logger.debug(
          `componentWillReceiveProps: new apps array ${JSON.stringify(
            apps
          )}`
        )
        profile.apps = apps
        const signedProfileTokenData = signProfileForUpload(
          profile,
          identityKeyPair,
          api
        )
        logger.debug(
          'componentWillReceiveProps: uploading updated profile with new apps array'
        )
        return uploadProfile(
          api,
          identity,
          identityKeyPair,
          signedProfileTokenData
        )
      })
      .then(() => profileUrl)
      .catch(err => {
        logger.error(
          'componentWillReceiveProps: add app index profile not uploaded',
          err
        )
      })
  }

  generateAuthResponse = (
    privateKey,
    blockchainId,
    appPrivateKey,
    profile,
    profileUrl
  ) => {
    const appDomain = this.state.decodedToken.payload.domain_name
    const email = this.props.email
    const sendEmail = this.state.sendEmail

    logger.debug(`profileUrl: ${profileUrl}`)
    logger.debug(`email: ${email}`)

    const metadata = {
      email: sendEmail ? email : null,
      profileUrl
    }

    const doNoIncludeProfile = this.state.decodedToken.payload
      .do_not_include_profile

    const profileResponseData = doNoIncludeProfile ? null : profile

    let transitPublicKey = undefined
    let hubUrl = undefined
    let blockstackAPIUrl = undefined
    let associationToken = undefined

    let requestVersion = '0'
    if (this.state.decodedToken.payload.hasOwnProperty('version')) {
      requestVersion = this.state.decodedToken.payload.version
    }

    if (
      isLaterVersion(requestVersion, '1.1.0') &&
      this.state.decodedToken.payload.public_keys.length > 0
    ) {
      transitPublicKey = this.state.decodedToken.payload.public_keys[0]
    }
    if (appRequestSupportsDirectHub(this.state.decodedToken.payload)) {
      hubUrl = this.props.api.gaiaHubUrl
    }
    if (isLaterVersion(requestVersion, '1.3.0')) {
      const compressedAppPublicKey = getPublicKeyFromPrivate(appPrivateKey.slice(0,64))
      const parsedCoreUrl = url.parse(this.props.api.nameLookupUrl)

      blockstackAPIUrl = `${parsedCoreUrl.protocol}//${parsedCoreUrl.host}`
      associationToken = makeGaiaAssociationToken(privateKey, compressedAppPublicKey)
    }

    const authResponse = makeAuthResponse(
      privateKey,
      profileResponseData,
      blockchainId,
      metadata,
      '',
      appPrivateKey,
      undefined,
      transitPublicKey,
      hubUrl,
      blockstackAPIUrl,
      associationToken
    )

    this.props.clearSessionToken(appDomain)
    return authResponse
  }

  closeModal() {
    this.context.router.push('/')
  }

  login = (identityIndex = this.state.currentIdentityIndex) => {
    this.setState({
      processing: true,
      invalidScopes: false
    })
    this.props.loginToApp()
    const localIdentities = this.props.localIdentities
    const identity = localIdentities[identityIndex]
    let hasUsername = identity.username && identity.username.length > 0
    // if (!identity.username || identity.usernamePending) {
    // logger.debug(`login(): the id ${identity.ownerAddress} has no username`)
    // hasUsername = false
    // }

    // check to see if username is resolvable until we get name state management
    // fixed in
    // https://github.com/blockstack/blockstack-browser/issues/864#issuecomment-335035037

    const lookupValue = hasUsername ? identity.username : ''

    // if profile has no name, lookupUrl will be
    // http://localhost:6270/v1/names/ which returns 401
    const lookupUrl = this.props.api.nameLookupUrl.replace(
      '{name}',
      lookupValue
    )
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

        const appDomain = this.state.decodedToken.payload.domain_name
        const scopes = this.state.decodedToken.payload.scopes
        const needsCoreStorage = !appRequestSupportsDirectHub(
          this.state.decodedToken.payload
        )

        const scopesJSONString = JSON.stringify(scopes)

        if (!validateScopes(scopes)) {
          this.setState({
            invalidScopes: true
          })
          logger.error(
            `login: App requesting unsupported scopes: ${scopesJSONString}`
          )
          return
        }

        this.setState({
          hasUsername,
          sendEmail: !!scopes.includes('email')
        })
        const requestingStoreWrite = !!scopes.includes('store_write')
        if (requestingStoreWrite && needsCoreStorage) {
          this.setState({})
          logger.error(
            'Tried logging in with core-enabled-storage,' +
              ' but that is no longer supported...'
          )
          return
        } else if (requestingStoreWrite && !needsCoreStorage) {
          logger.info(
            'login(): app can communicate directly with gaiahub, not setting up core.'
          )
          this.setState({
            noCoreStorage: true
          })
          this.props.noCoreSessionToken(appDomain)
          this.sendAuthResponse()
        } else {
          logger.info('login(): No storage access requested.')
          this.setState({
            noCoreStorage: true
          })
          this.props.noCoreSessionToken(appDomain)
        }
      })
  }

  updateView = view => this.setState({ view })
  backView = (view = this.state.view) => {
    if (view - 1 >= 0) {
      return this.setState({
        view: view - 1
      })
    } else {
      return null
    }
  }

  render() {
    const {
      appManifest,
      appManifestLoading,
      appManifestLoadingError
    } = this.props

    if (appManifestLoadingError) {
      return (
        <>
          <Modal
            className="container-fluid"
            shouldCloseOnOverlayClick={false}
            isOpen
          >
            <div className="alert alert-danger">
              Failed to fetch information about the app requesting
              authentication. Please contact the app maintainer to resolve the
              issue.
            </div>
          </Modal>
          <AppHomeWrapper />
        </>
      )
    }
    if (!appManifest || appManifestLoading) {
      // to have an empty space until loading is complete
      return <> </>
    }

    const { invalidScopes, decodedToken } = this.state

    const noCoreStorage =
      decodedToken &&
      decodedToken.payload.scopes &&
      (!decodedToken.payload.scopes.includes('store_write') ||
        appRequestSupportsDirectHub(decodedToken.payload))

    const coreShortCircuit =
      !appManifestLoading &&
      appManifest !== null &&
      !invalidScopes &&
      !noCoreStorage

    const app = formatAppManifest(this.props.appManifest)

    const viewProps = [
      {
        show: VIEWS.AUTH,
        props: {
          permissions: this.state.scopes,
          login: i => {
            this.setState(
              {
                currentIdentityIndex: i
              },
              () => this.login()
            )
          },
          deny: () => console.log('go back to app'),
          backLabel: 'Cancel',
          backView: () => {
            if (document.referrer === '') {
              window.close()
            } else {
              history.back()
            }
          },
          accounts: this.props.localIdentities,
          processing: this.state.processing,
          refreshingIdentities: this.state.refreshingIdentities,
          selectedIndex: this.state.currentIdentityIndex
        }
      },
      {
        show: VIEWS.LEGACY_GAIA,
        props: {
          back: () => console.log('go back to app')
        }
      }
    ]

    const currentViewProps = viewProps[0]
    const appDomain = this.state.decodedToken.payload.domain_name

    const componentProps = {
      ...currentViewProps.props,
      app,
      appDomain,
      view: coreShortCircuit ? VIEWS.LEGACY_GAIA : VIEWS.AUTH
    }

    return (
      <>
        <ShellParent app={app} views={views} {...componentProps} maxHeight />
        <AppHomeWrapper />
      </>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthPage)
