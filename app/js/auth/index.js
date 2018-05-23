import React from 'react'
import PropTypes from 'prop-types'
import { ShellParent } from '@blockstack/ui'
import { Initial, LegacyGaia } from './views'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { AuthActions } from './store/auth'
import { decodeToken } from 'jsontokens'
import {
  makeAuthResponse,
  getAuthRequestFromURL,
  Person,
  redirectUserToApp,
  getAppBucketUrl,
  isLaterVersion
} from 'blockstack'
import { AppsNode } from '@utils/account-utils'
import {
  fetchProfileLocations,
  getDefaultProfileUrl
} from '@utils/profile-utils'
import { getTokenFileUrlFromZoneFile } from '@utils/zone-utils'
import { HDNode } from 'bitcoinjs-lib'
import log4js from 'log4js'
import { uploadProfile } from '../account/utils'
import { signProfileForUpload } from '@utils'
import { validateScopes, appRequestSupportsDirectHub } from './utils'
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
  selectPublicKeychain
} from '@common/store/selectors/account'

const views = [Initial, LegacyGaia]

const logger = log4js.getLogger('auth/components/AuthModal.js')

const VIEWS = {
  AUTH: 0,
  LEGACY_GAIA: 1
}
function mapStateToProps(state) {
  return {
    localIdentities: selectLocalIdentities(state),
    defaultIdentity: selectDefaultIdentity(state),
    identityKeypairs: selectIdentityKeypairs(state),
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
  const actions = Object.assign({}, AuthActions)
  return bindActionCreators(actions, dispatch)
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
    coreHost: PropTypes.string.isRequired,
    corePort: PropTypes.number.isRequired,
    appManifest: PropTypes.object,
    appManifestLoading: PropTypes.bool,
    email: PropTypes.string,
    noCoreSessionToken: PropTypes.func.isRequired,
    addresses: PropTypes.array.isRequired,
    publicKeychain: PropTypes.string.isRequired
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
      },
      view: VIEWS.AUTH
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
      if (!appDomain || !nextProps.coreSessionTokens[appDomain]) {
        if (this.state.noCoreStorage) {
          logger.debug(
            'componentWillReceiveProps: no core session token expected'
          )
        } else {
          logger.debug(
            'componentWillReceiveProps: no app domain or no core session token'
          )
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

      let profileUrlPromise

      if (identity.zoneFile && identity.zoneFile.length > 0) {
        const profileUrlFromZonefile = getTokenFileUrlFromZoneFile(
          identity.zoneFile
        )
        if (
          profileUrlFromZonefile !== null &&
          profileUrlFromZonefile !== undefined
        ) {
          profileUrlPromise = Promise.resolve(profileUrlFromZonefile)
        }
      }

      const gaiaBucketAddress = nextProps.identityKeypairs[0].address
      const identityAddress = nextProps.identityKeypairs[identityIndex].address
      const gaiaUrlBase = 'https://gaia.blockstack.org/hub'

      if (!profileUrlPromise) {
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
          let apps = {}
          if (profile.hasOwnProperty('apps')) {
            apps = profile.apps
          }

          if (storageConnected) {
            getAppBucketUrl('https://hub.blockstack.org', appPrivateKey)
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
                  nextProps.identityKeypairs[identityIndex]
                )
                logger.debug(
                  'componentWillReceiveProps: uploading updated profile with new apps array'
                )
                return uploadProfile(
                  this.props.api,
                  identity,
                  nextProps.identityKeypairs[identityIndex],
                  signedProfileTokenData
                )
              })
              .then(() => {
                this.completeAuthResponse(
                  privateKey,
                  blockchainId,
                  coreSessionToken,
                  appPrivateKey,
                  profile,
                  profileUrl
                )
              })
              .catch(err => {
                logger.error(
                  'componentWillReceiveProps: add app index profile not uploaded',
                  err
                )
              })
          } else {
            logger.debug(
              'componentWillReceiveProps: storage is not connected. Doing nothing.'
            )
          }
        } else {
          this.completeAuthResponse(
            privateKey,
            blockchainId,
            coreSessionToken,
            appPrivateKey,
            profile,
            profileUrl
          )
        }
      })
    } else {
      logger.error(
        'componentWillReceiveProps: response already sent - doing nothing'
      )
    }
  }

  completeAuthResponse = (
    privateKey,
    blockchainId,
    coreSessionToken,
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
      hubUrl = this.props.api.gaiaHubConfig.server
    }

    const authResponse = makeAuthResponse(
      privateKey,
      profileResponseData,
      blockchainId,
      metadata,
      coreSessionToken,
      appPrivateKey,
      undefined,
      transitPublicKey,
      hubUrl
    )

    this.props.clearSessionToken(appDomain)

    logger.trace(
      `login(): id index ${this.state.currentIdentityIndex} is logging in`
    )
    this.setState({ responseSent: true })
    redirectUserToApp(this.state.authRequest, authResponse)
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
    let hasUsername = true
    if (!identity.username || identity.usernamePending) {
      logger.debug(`login(): the id ${identity.ownerAddress} has no username`)
      hasUsername = false
    }

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
          logger.trace(
            'login(): app can communicate directly with gaiahub, not setting up core.'
          )
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
    const { appManifest, appManifestLoading } = this.props

    if (!appManifest || appManifestLoading) {
      return <React.Fragment> </React.Fragment>
    }

    const { processing, invalidScopes, decodedToken } = this.state

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

    const app = {
      name: appManifest.name,
      icon: appManifest.icons[0].src
    }

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
          accounts: this.props.localIdentities,
          processing: this.state.processing,
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

    const componentProps = {
      ...currentViewProps.props,
      app,
      view: coreShortCircuit ? VIEWS.LEGACY_GAIA : VIEWS.AUTH
    }

    return <ShellParent app={app} views={views} {...componentProps} />
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthPage)
