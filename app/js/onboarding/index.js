import React from 'react'
import PropTypes from 'prop-types'
import { browserHistory, withRouter } from 'react-router'
import {
  selectConnectedStorageAtLeastOnce,
  selectEmail,
  selectEncryptedBackupPhrase,
  selectIdentityAddresses,
  selectIdentityKeypairs,
  selectPromptedForEmail
} from '@common/store/selectors/account'
import {
  selectLocalIdentities,
  selectRegistration
} from '@common/store/selectors/profiles'

import {
  selectApi,
  selectStorageConnected
} from '@common/store/selectors/settings'

import {
  selectAppManifest,
  selectAppManifestLoaded,
  selectAppManifestLoading,
  selectAppManifestLoadingError
} from '@common/store/selectors/auth'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { AuthActions } from '../auth/store/auth'
import { AccountActions } from '../account/store/account'
import { IdentityActions } from '../profiles/store/identity'
import { SettingsActions } from '../account/store/settings'
import { connectToGaiaHub } from '../account/utils/blockstack-inc'
import { RegistrationActions } from '../profiles/store/registration'
import { BLOCKSTACK_INC } from '../account/utils/index'
import { setCoreStorageConfig } from '@utils/api-utils'
import { hasNameBeenPreordered } from '@utils/name-utils'
import queryString from 'query-string'
import log4js from 'log4js'

import { ShellParent } from '@blockstack/ui'
import { Email, Password, Success, Username } from './views'

const logger = log4js.getLogger('onboarding/index.js')

const views = [Email, Password, Username, Success]
const VIEWS = {
  EMAIL: 0,
  PASSWORD: 1,
  USERNAME: 2,
  HOORAY: 3
}

const SUBDOMAIN_SUFFIX = 'test-personal.id'
const SERVER_URL = 'https://browser-api.blockstack.org'

const mapStateToProps = state => ({
  updateApi: PropTypes.func.isRequired,
  localIdentities: selectLocalIdentities(state),
  registration: selectRegistration(state),
  storageConnected: selectStorageConnected(state),
  api: selectApi(state),
  promptedForEmail: selectPromptedForEmail(state),
  encryptedBackupPhrase: selectEncryptedBackupPhrase(state),
  identityAddresses: selectIdentityAddresses(state),
  identityKeypairs: selectIdentityKeypairs(state),
  connectedStorageAtLeastOnce: selectConnectedStorageAtLeastOnce(state),
  email: selectEmail(state),
  appManifest: selectAppManifest(state),
  appManifestLoaded: selectAppManifestLoaded(state),
  appManifestLoading: selectAppManifestLoading(state),
  appManifestLoadingError: selectAppManifestLoadingError(state)
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      ...AccountActions,
      ...SettingsActions,
      ...IdentityActions,
      ...RegistrationActions,
      ...AuthActions
    },
    dispatch
  )

class Onboarding extends React.Component {
  state = {
    authRequest: '',
    email: '',
    password: '',
    username: '',
    seed: '',
    appManifest: null,
    emailSubmitted: false,
    emailsSent: false,
    loading: false,
    view: VIEWS.EMAIL,
    usernameRegistrationInProgress: false
  }
  updateValue = (key, value) => {
    this.setState({ [key]: value })
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
  submitPassword = () => {
    const { username, email } = this.state
    if (username.length < 1) {
      this.setState({
        email
      })
    }
    this.updateView(VIEWS.USERNAME)
  }
  submitUsername = username => {
    this.setState({
      loading: true
    })
    logger.debug('creating account')
    this.createAccount(this.state.password)
      .then(() => this.connectStorage())
      .then(() => {
        console.log('about to submit username')
        const suffix = `.${SUBDOMAIN_SUFFIX}`
        username += suffix
        logger.trace('registerUsername')
        const nameHasBeenPreordered = hasNameBeenPreordered(
          username,
          this.props.localIdentities
        )
        if (nameHasBeenPreordered) {
          logger.error(
            `registerUsername: username '${username}' has already been preordered`
          )
        } else {
          this.setState({
            usernameRegistrationInProgress: true
          })
          logger.debug(
            `registerUsername: will try and register username: ${username}`
          )
          const address = this.props.identityAddresses[0]
          const identity = this.props.localIdentities[0]
          const keypair = this.props.identityKeypairs[0]
          this.props.registerName(
            this.props.api,
            username,
            identity,
            0,
            address,
            keypair
          )
        }
        this.updateView(VIEWS.HOORAY)
        this.setState({
          loading: false
        })
      })
  }
  finish = () => {
    if (this.props.appManifest) {
      this.redirectToAuth()
    } else {
      this.redirectToHome()
    }
  }
  redirectToAuth = () => {
    this.props.router.push(`/auth/?authRequest=${this.state.authRequest}`)
  }
  redirectToHome = () => {
    this.props.router.push('/')
  }
  goToBackup = () => {
    browserHistory.push({
      pathname: '/seed',
      state: { seed: this.state.seed, password: this.state.password }
    })
  }
  sendEmails = async () => {
    const { encryptedBackupPhrase } = this.props
    const { username, email } = this.state

    if (!encryptedBackupPhrase) {
      console.log('no encryptedBackupPhrase')
      return null
    }
    this.setState({ emailsSent: true })
    return Promise.all([
      this.sendRestore(username, email, encryptedBackupPhrase),
      this.sendRecovery(username, email, encryptedBackupPhrase)
    ])
  }
  submitEmailForVerification = () => {
    // Skip email verification
    this.updateView(VIEWS.PASSWORD)

    // verifyEmail(this.state.email)
    // this.updateView(VIEWS.EMAIL_VERIFY)
  }

  componentWillMount() {
    const { location } = this.props
    const queryDict = queryString.parse(location.search)
    const authRequest = this.checkForAuthRequest(queryDict)
    if (authRequest && this.state.authRequest !== authRequest) {
      this.decodeAndSaveAuthRequest()
      this.setState({
        authRequest
      })
    }
    if (location.query.verified) {
      this.setState({ email: location.query.verified })
      this.updateView(VIEWS.PASSWORD)
    }
  }

  componentDidMount() {
    // this.decodeAndSaveAuthRequest()
    if (!this.props.api.subdomains[SUBDOMAIN_SUFFIX]) {
      this.props.resetApi(this.props.api)
    }
  }

  componentWillReceiveProps(nextProps) {
    const { registration } = nextProps
    const { usernameRegistrationInProgress, emailsSent } = this.state
    if (usernameRegistrationInProgress && registration.registrationSubmitted) {
      if (!emailsSent) {
        this.sendEmails().then(() => this.updateView(VIEWS.HOORAY))
      } else {
        this.updateView(VIEWS.HOORAY)
      }
    } else if (registration.error) {
      logger.error(`username registration error: ${registration.error}`)
      this.setState({
        usernameRegistrationInProgress: false
      })
    }
  }

  decodeAndSaveAuthRequest() {
    const { verifyAuthRequestAndLoadManifest, appManifestLoading } = this.props
    const queryDict = queryString.parse(this.props.location.search)

    const authRequest = this.checkForAuthRequest(queryDict)

    if (authRequest && !this.state.authRequest)
      this.setState({
        authRequest
      })

    if (authRequest && !appManifestLoading) {
      verifyAuthRequestAndLoadManifest(authRequest)
    }
  }

  checkForAuthRequest = queryDict => {
    if (queryDict.redirect !== null && queryDict.redirect !== undefined) {
      const searchString = queryDict.redirect.replace('/auth', '')
      const redirectQueryDict = queryString.parse(searchString)
      if (
        redirectQueryDict.authRequest !== null &&
        redirectQueryDict.authRequest !== undefined
      ) {
        let authRequest = redirectQueryDict.authRequest
        if (authRequest.includes('#coreAPIPassword')) {
          authRequest = authRequest.split('#coreAPIPassword')[0]
        }
        return authRequest
      }
    }
    return null
  }

  sendRecovery(blockstackId, email, encryptedSeed) {
    const { protocol, hostname, port } = location
    const thisUrl = `${protocol}//${hostname}${port && `:${port}`}`
    const seedRecovery = `${thisUrl}/seed?encrypted=${encryptedSeed}`

    const options = {
      method: 'POST',
      body: JSON.stringify({
        email,
        seedRecovery,
        blockstackId
      }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }

    return fetch(`${SERVER_URL}/recovery`, options)
      .then(
        () => {
          console.log(`emailNotifications: sent ${email} recovery email`)
        },
        error => {
          console.log('emailNotifications: error', error)
        }
      )
      .catch(error => {
        console.log('emailNotifications: error', error)
      })
  }

  sendRestore(blockstackId, email, encryptedSeed) {
    const options = {
      method: 'POST',
      body: JSON.stringify({
        email,
        encryptedSeed,
        blockstackId
      }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }

    return fetch(`${SERVER_URL}/restore`, options)
      .then(
        () => {
          console.log(`emailNotifications: sent ${email} restore email`)
        },
        error => {
          console.log('emailNotifications: error', error)
        }
      )
      .catch(error => {
        console.log('emailNotifications: error', error)
      })
  }

  createAccount(password) {
    const {
      initializeWallet,
      identityAddresses,
      createNewIdentityWithOwnerAddress,
      setDefaultIdentity
    } = this.props

    const firstIdentityIndex = 0
    return initializeWallet(password, null)
      .then(() => {
        logger.debug('creating new identity')
        const ownerAddress = identityAddresses[firstIdentityIndex]
        return createNewIdentityWithOwnerAddress(
          firstIdentityIndex,
          ownerAddress
        )
      })
      .then(() => setDefaultIdentity(firstIdentityIndex))
  }

  connectStorage() {
    const storageProvider = this.props.api.gaiaHubUrl
    const signer = this.props.identityKeypairs[0].key
    return connectToGaiaHub(storageProvider, signer).then(gaiaHubConfig => {
      const newApi = Object.assign({}, this.props.api, {
        gaiaHubConfig,
        hostedDataLocation: BLOCKSTACK_INC
      })
      this.props.updateApi(newApi)
      const identityIndex = 0
      const identity = this.props.localIdentities[identityIndex]
      const identityAddress = identity.ownerAddress
      const profileSigningKeypair = this.props.identityKeypairs[identityIndex]
      const profile = identity.profile
      setCoreStorageConfig(
        newApi,
        identityIndex,
        identityAddress,
        profile,
        profileSigningKeypair,
        identity
      ).then(() => {
        logger.debug('connectStorage: storage initialized')
        const newApi2 = Object.assign({}, newApi, { storageConnected: true })
        this.props.updateApi(newApi2)
        this.props.storageIsConnected()
        logger.debug('connectStorage: storage configured')
      })
    })
  }

  render() {
    const { appManifest } = this.props
    const { email, password, username, emailSubmitted, view } = this.state

    const icons = appManifest ? appManifest.icons : []
    const appIconURL = icons.length > 0 ? icons[0].src : null
    const appName = appManifest ? appManifest.name : undefined

    const app = appManifest
      ? {
          name: appName,
          icon: appIconURL
        }
      : false

    const viewProps = [
      {
        show: VIEWS.EMAIL,
        props: {
          email,
          next: () => this.updateView(VIEWS.PASSWORD),
          submitted: emailSubmitted,
          updateValue: this.updateValue
        }
      },
      {
        show: VIEWS.PASSWORD,
        props: {
          password,
          loading: this.state.loading,
          next: this.submitPassword,
          updateValue: this.updateValue
        }
      },
      {
        show: VIEWS.USERNAME,
        props: {
          username,
          next: this.submitUsername,
          previous: () => this.updateView(VIEWS.PASSWORD),
          updateValue: this.updateValue,
          isProcessing: this.state.usernameRegistrationInProgress,
          loading: this.state.loading
        }
      },
      {
        show: VIEWS.HOORAY,
        props: {
          email,
          password,
          username,
          app,
          id: this.props.identityAddresses[0],
          subdomainSuffix: SUBDOMAIN_SUFFIX,
          goToRecovery: this.goToBackup,
          finish: () => this.finish()
        }
      }
    ]

    const currentViewProps = viewProps.find(v => v.show === view) || {}

    const componentProps = {
      email,
      password,
      username,
      emailSubmitted,
      view,
      backView: v => this.backView(v),
      ...currentViewProps.props
    }

    return (
      <ShellParent
        app={app}
        views={views}
        {...componentProps}
        lastHeaderLabel="Welcome to Blockstack"
        headerLabel="Create a Blockstack ID"
        invertOnLast
      />
    )
  }
}

Onboarding.propTypes = {
  api: PropTypes.object.isRequired,
  location: PropTypes.object,
  router: PropTypes.object,
  appManifest: PropTypes.object,
  appManifestLoading: PropTypes.bool,
  appManifestLoaded: PropTypes.bool,
  appManifestLoadingError: PropTypes.node,
  identityAddresses: PropTypes.array,
  createNewIdentityWithOwnerAddress: PropTypes.func.isRequired,
  setDefaultIdentity: PropTypes.func.isRequired,
  initializeWallet: PropTypes.func.isRequired,
  updateApi: PropTypes.func.isRequired,
  localIdentities: PropTypes.array.isRequired,
  identityKeypairs: PropTypes.array.isRequired,
  storageIsConnected: PropTypes.func.isRequired,
  registerName: PropTypes.func.isRequired,
  resetApi: PropTypes.func.isRequired,
  verifyAuthRequestAndLoadManifest: PropTypes.func.isRequired,
  encryptedBackupPhrase: PropTypes.string
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Onboarding)
)
