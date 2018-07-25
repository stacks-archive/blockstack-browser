import React from 'react'
import PropTypes from 'prop-types'
import { browserHistory, withRouter } from 'react-router'
import App from '../App'
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
import { ServerAPI, trackEventOnce } from '@utils/server-utils';
import queryString from 'query-string'
import log4js from 'log4js'
import { formatAppManifest } from '@common'
import { ShellParent, AppHomeWrapper } from '@blockstack/ui'
import {
  Email,
  Password,
  Success,
  Username,
  RecoveryInformationScreen
} from './views'

const logger = log4js.getLogger('onboarding/index.js')

const views = [Email, Password, Username, RecoveryInformationScreen, Success]
const VIEWS = {
  EMAIL: 0,
  PASSWORD: 1,
  USERNAME: 2,
  INFO: 3,
  HOORAY: 4
}
const VIEW_EVENTS = {
  [VIEWS.EMAIL]: 'Onboarding - Email',
  [VIEWS.PASSWORD]: 'Onboarding - Password',
  [VIEWS.USERNAME]: 'Onboarding - Username',
  [VIEWS.INFO]: 'Onboarding - Info',
  [VIEWS.HOORAY]: 'Onboarding - Complete'
}

const SUBDOMAIN_SUFFIX = 'id.blockstack'

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

const CREATE_ACCOUNT_INITIAL = 'createAccount/initial'
const CREATE_ACCOUNT_STARTED = 'createAccount/started'
const CREATE_ACCOUNT_IN_PROCESS = 'createAccount/in_process'
const CREATE_ACCOUNT_SUCCESS = 'createAccount/success'

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
    emailConsent: false,
    emailSubmitted: false,
    emailsSending: false,
    emailsSent: false,
    loading: false,
    creatingAccountStatus: CREATE_ACCOUNT_INITIAL,
    view: VIEWS.EMAIL,
    usernameRegistrationInProgress: false
  }
  updateValue = (key, value) => {
    this.setState({ [key]: value })
  }

  toggleConsent = () => {
    this.setState(state => ({
      ...state,
      emailConsent: !state.emailConsent
    }))
  }

  updateView = view => {
    this.setState({ view })
    trackEventOnce(VIEW_EVENTS[view])
  }

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
  /**
   * Submit Username
   * This will create our account and then register a name and connect storage
   */
  submitUsername = username => {
    this.setState({
      creatingAccountStatus: CREATE_ACCOUNT_STARTED,
      username,
      loading: true
    })
  }

  /**
   * This is our main function for creating a new account
   */
  createAccount = () => {
    const { username, password } = this.state
    if (!username) {
      throw new Error('Missing a username! How did that happen?')
    } else if (!password) {
      throw new Error('Missing a password! How did that happen?')
    }
    logger.debug('creating account, createAccount()')

    this.setState({
      creatingAccountStatus: CREATE_ACCOUNT_IN_PROCESS
    })
    // Initialize our wallet
    this.initializeWallet().then(() =>
      // Create new ID and owner address and then set to default
      this.createNewIdAndSetDefault().then(() =>
        // Connect our default storage
        this.connectStorage().then(() =>
          // Finally, register the username
          this.registerUsername()
        )
      )
    )
  }

  /**
   * Register the username
   */
  registerUsername = async () => {
    console.log('registerUsername()')
    let username = this.state.username
    const suffix = `.${SUBDOMAIN_SUFFIX}`
    username += suffix
    console.log('about to submit username', username)
    logger.trace('registerUsername')
    const nameHasBeenPreordered = hasNameBeenPreordered(
      username,
      this.props.localIdentities
    )
    if (nameHasBeenPreordered) {
      /**
       * TODO: redirect them back and then have them choose a new name
       */
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

      /**
       * This is assuming that there are no accounts, and we're using the first item in the arrays
       */
      const identityIndex = 0
      const address = this.props.identityAddresses[identityIndex]
      const identity = this.props.localIdentities[identityIndex]
      const keypair = this.props.identityKeypairs[identityIndex]

      this.props.registerName(
        this.props.api,
        username,
        identity,
        identityIndex,
        address,
        keypair
      )
      this.setState({
        creatingAccountStatus: CREATE_ACCOUNT_SUCCESS
      })
    }
  }
  /**
   * Finish step
   * this will either send us home or to the app that the user came from
   */
  finish = () => {
    if (this.props.appManifest) {
      this.redirectToAuth()
    } else {
      this.redirectToHome()
    }
  }
  /**
   * Redirect to Auth Request
   */
  redirectToAuth = () => {
    this.props.router.push(`/auth/?authRequest=${this.state.authRequest}`)
  }
  /**
   * Redirect to home
   */
  redirectToHome = () => {
    this.props.router.push('/')
  }
  /**
   * Go to Backup
   * This will navigate the user to the seed screen
   */
  goToBackup = () => {
    browserHistory.push({
      pathname: '/seed',
      state: { seed: this.state.seed, password: this.state.password }
    })
  }

  /**
   * Send Emails
   * this will send both emails (restore and recovery)
   */
  sendEmails = async (type = 'both') => {
    const { encryptedBackupPhrase } = this.props
    const { username, email } = this.state

    /**
     * TODO: add this as a notification or something the user can see
     */
    if (!encryptedBackupPhrase) {
      return null
    }

    const fullUsername = `${username}.${SUBDOMAIN_SUFFIX}`

    const b64EncryptedBackupPhrase = new Buffer(
      encryptedBackupPhrase,
      'hex'
    ).toString('base64')

    if (type === 'recovery') {
      await this.sendRecovery(fullUsername, email, b64EncryptedBackupPhrase)
    } else if (type === 'restore') {
      await this.sendRestore(fullUsername, email, b64EncryptedBackupPhrase)
    } else {
      await this.sendRestore(fullUsername, email, b64EncryptedBackupPhrase)
      await this.sendRecovery(fullUsername, email, b64EncryptedBackupPhrase)
    }

    return this.setState({
      emailsSending: false,
      emailsSent: true
    })
  }

  /**
   * Decode and save auth request
   *
   * this will save the authRequest to component state and then
   * call the redux action verifyAuthRequestAndLoadManifest
   * which then verifies it and downloads the app manifest
   */
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

  /**
   * Check for Auth Request
   * this returns the authRequest query param if one exists
   */
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

  /**
   * Send Recovery Email
   */
  sendRecovery(blockstackId, email, encryptedSeed) {
    const { protocol, hostname, port } = location
    const thisUrl = `${protocol}//${hostname}${port && `:${port}`}`
    const seedRecovery = `${thisUrl}/seed?encrypted=${encodeURIComponent(
      encryptedSeed
    )}`

    return ServerAPI.post('/recovery', {
      email,
      seedRecovery,
      blockstackId
    })
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

  /**
   * Send restore email
   */
  sendRestore(blockstackId, email, encryptedSeed) {
    return ServerAPI.post('/restore', {
      email,
      encryptedSeed,
      blockstackId
    })
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

  /**
   * initialize our wallet
   * this will initialize our wallet and then create an account for us
   * see account/actions.js
   */
  async initializeWallet() {
    const { password } = this.state
    const { initializeWallet } = this.props
    return initializeWallet(password, null)
  }

  /**
   * Create ID and Set it as default
   * this function needs to fire after the initializeWallet function has finished
   * it will generate a new ID with address and set it as the default ID
   */
  async createNewIdAndSetDefault() {
    const {
      identityAddresses,
      createNewIdentityWithOwnerAddress,
      setDefaultIdentity
    } = this.props
    const firstIdentityIndex = 0
    logger.debug('creating new identity')
    const ownerAddress = identityAddresses[firstIdentityIndex]
    logger.debug('ownerAddress', ownerAddress)
    createNewIdentityWithOwnerAddress(firstIdentityIndex, ownerAddress)
    logger.debug('settingAsDefault')
    setDefaultIdentity(firstIdentityIndex)
  }

  /**
   * Connect Storage
   */
  async connectStorage() {
    logger.debug('fire connectStorage')
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
      )
      logger.debug('connectStorage: storage initialized')
      const newApi2 = Object.assign({}, newApi, { storageConnected: true })
      this.props.updateApi(newApi2)
      this.props.storageIsConnected()
      logger.debug('connectStorage: storage configured')
      logger.debug('connectStorage has finished')
    })
  }

  /**
   * Next function for the recovery info screen
   */
  infoNext = () => {
    this.props.emailNotifications(this.state.email, this.state.emailConsent)
    this.updateView(VIEWS.HOORAY)
  }

  componentDidUpdate() {
    const { creatingAccountStatus, loading, username, password } = this.state

    const registrationBegin =
      creatingAccountStatus === CREATE_ACCOUNT_STARTED &&
      loading &&
      username &&
      password

    if (registrationBegin) {
      setTimeout(() => this.createAccount(), 500)
    }
  }

  componentWillMount() {
    if (this.props.encryptedBackupPhrase) {
      this.props.router.push('/')
    }
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
    if (!this.props.api.subdomains[SUBDOMAIN_SUFFIX]) {
      this.props.resetApi(this.props.api)
    }

    trackEventOnce(VIEW_EVENTS[this.state.view])
  }

  componentWillReceiveProps(nextProps) {
    const { registration } = nextProps
    const {
      usernameRegistrationInProgress,
      emailsSent,
      emailsSending
    } = this.state
    if (usernameRegistrationInProgress && registration.registrationSubmitted) {
      if (!emailsSent && !emailsSending) {
        this.setState({
          emailsSending: true
        })
        this.sendEmails().then(() => this.updateView(VIEWS.INFO))
      }
    } else if (registration.error) {
      logger.error(`username registration error: ${registration.error}`)
      this.setState({
        usernameRegistrationInProgress: false
      })
    }
  }

  render() {
    const { appManifest } = this.props
    const { email, password, username, emailSubmitted, view } = this.state

    const app = formatAppManifest(appManifest)

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
        show: VIEWS.INFO,
        props: {
          email,
          password,
          username,
          app,
          sendRecoveryEmail: () => this.sendEmails('restore'),
          next: () => this.infoNext()
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
      toggleConsent: () => this.toggleConsent(),
      consent: this.state.emailConsent,
      backView: v => this.backView(v),
      ...currentViewProps.props
    }

    return (
      <App>
        <ShellParent
          app={app}
          views={views}
          {...componentProps}
          lastHeaderLabel="Welcome to Blockstack"
          headerLabel="Create a Blockstack ID"
          invertOnLast
          disableBackOnView={VIEWS.INFO}
          disableBack={this.state.loading}
        />
        <AppHomeWrapper />
      </App>
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
  emailNotifications: PropTypes.func.isRequired,
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
