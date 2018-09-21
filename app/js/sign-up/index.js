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
import { RegistrationActions } from '../profiles/store/registration'
import { hasNameBeenPreordered } from '@utils/name-utils'
import { trackEventOnce } from '@utils/server-utils'
import { sendRecoveryEmail, sendRestoreEmail } from '@utils/email-utils'
import queryString from 'query-string'
import log4js from 'log4js'
import { formatAppManifest } from '@common'
import { ShellParent, AppHomeWrapper } from '@blockstack/ui'
import {
  Initial,
  Email,
  Password,
  Success,
  Username,
  RecoveryInformationScreen
} from './views'
import { notify } from 'reapop'

const logger = log4js.getLogger(__filename)

/**
 * View Order
 *
 * To adjust the sequence of views, change their index here
 */
const views = [
  Initial,
  Username,
  Password,
  Email,
  RecoveryInformationScreen,
  Success
]
const VIEWS = {
  INITIAL: 0,
  USERNAME: 1,
  PASSWORD: 2,
  EMAIL: 3,
  INFO: 4,
  HOORAY: 5
}
const VIEW_EVENTS = {
  [VIEWS.INITIAL]: 'Onboarding - Initial',
  [VIEWS.EMAIL]: 'Onboarding - Email',
  [VIEWS.PASSWORD]: 'Onboarding - Password',
  [VIEWS.USERNAME]: 'Onboarding - Username',
  [VIEWS.INFO]: 'Onboarding - Info',
  [VIEWS.HOORAY]: 'Onboarding - Complete'
}

const SUBDOMAIN_SUFFIX = 'id.blockstack'

const mapStateToProps = state => ({
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
      ...AuthActions,
      notify
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
    recoveryEmailError: null,
    restoreEmailError: null,
    loading: false,
    view: VIEWS.INITIAL,
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
    this.trackViewEvent(view, this.props.appManifest)
  }

  trackViewEvent = (view, appManifest) => {
    trackEventOnce(VIEW_EVENTS[view], {
      appReferrer: appManifest ? appManifest.name : 'N/A'
    })
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
  /**
   * Submit our password
   */
  submitPassword = async () => {
    this.setState({
      loading: true
    })
    await this.createAccount()
    this.updateView(VIEWS.EMAIL)
  }
  /**
   * Submit Username
   * This will create our account and then register a name and connect storage
   */
  submitUsername = username => {
    this.setState(
      {
        username
      },
      () => this.updateView(VIEWS.PASSWORD)
    )
  }

  /**
   * This is our main function for creating a new account
   */
  createAccount = async () => {
    const { password } = this.state
    if (!password) {
      throw new Error('Missing a password! How did that happen?')
    }
    logger.debug('creating account, createAccount()')

    // Initialize our wallet
    await this.initializeWallet()
    // Create new ID and owner address and then set to default
    await this.createNewIdAndSetDefault()
    // Connect our default storage
    await this.props.connectStorage()
    // Register the username
    await this.registerUsername()
  }

  /**
   * Register the username
   */
  registerUsername = async () => {
    logger.trace('registerUsername')
    let username = this.state.username
    if (!username) {
      logger.info('registerUsername: no username set, skipping registration')
      return Promise.resolve()
    }
    const suffix = `.${SUBDOMAIN_SUFFIX}`
    username += suffix
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
      return Promise.resolve()
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

      return this.props
        .registerName(
          this.props.api,
          username,
          identity,
          identityIndex,
          address,
          keypair
        )
        .catch(err => {
          logger.error(`username registration error: ${err}`)
          this.props.notify({
            title: 'Username Registration Failed',
            message:
              `Sorry, something went wrong while registering ${username}. ` +
              'You can try to register again later from your profile page. Some ' +
              'apps may be unusable until you do.',
            status: 'error',
            dismissAfter: 0,
            dismissible: true,
            closeButton: true,
            position: 'b'
          })
          this.setState({
            username: ''
          })
        })
        .then(() => {
          this.setState({
            usernameRegistrationInProgress: false
          })
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
  sendEmails = (type = 'both') => {
    const { encryptedBackupPhrase } = this.props
    const { username, email } = this.state
    const id = username ? `${username}.${SUBDOMAIN_SUFFIX}` : undefined

    /**
     * TODO: add this as a notification or something the user can see
     */
    if (!encryptedBackupPhrase) {
      return null
    }

    const encodedPhrase = new Buffer(encryptedBackupPhrase, 'hex').toString(
      'base64'
    )

    this.setState({
      emailsSending: true,
      emailsSent: false
    })

    let recoveryPromise = Promise.resolve()
    let restorePromise = Promise.resolve()
    if (type === 'recovery' || type === 'both') {
      recoveryPromise = sendRecoveryEmail(email, id, encodedPhrase)
        .then(() => this.setState({ recoveryEmailError: null }))
        .catch(err => this.setState({ recoveryEmailError: err }))
    }
    if (type === 'restore' || type === 'both') {
      restorePromise = sendRestoreEmail(email, id, encodedPhrase)
        .then(() => this.setState({ restoreEmailError: null }))
        .catch(err => this.setState({ restoreEmailError: err }))
    }

    return Promise.all([recoveryPromise, restorePromise]).then(() => {
      this.setState({
        emailsSending: false,
        emailsSent: true
      })
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
   * Next function for the recovery info screen
   */
  infoNext = () => {
    this.props.emailNotifications(this.state.email, this.state.emailConsent)
    this.updateView(VIEWS.HOORAY)
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
    } else {
      // Only fire track immediately if there's no manifest. Otherwise, fire
      // track event in componentWillReceiveProps.
      this.trackViewEvent(this.state.view)
    }

    if (location.query.verified) {
      this.setState({ email: location.query.verified })
      this.updateView(VIEWS.PASSWORD)
    }
  }

  submitEmail = async () => {
    // Send the emails
    await this.sendEmails()
    this.updateView(VIEWS.INFO)
  }

  componentDidMount() {
    if (!this.props.api.subdomains[SUBDOMAIN_SUFFIX]) {
      this.props.resetApi(this.props.api)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.appManifest) {
      // If we were waiting on an appManifest, we haven't tracked yet.
      this.trackViewEvent(this.state.view, nextProps.appManifest)
    }
  }

  render() {
    const { appManifest } = this.props
    const { email, password, username, emailSubmitted, view } = this.state

    const app = formatAppManifest(appManifest)

    const viewProps = [
      {
        show: VIEWS.INITIAL,
        props: {
          next: () => this.updateView(VIEWS.USERNAME)
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
        show: VIEWS.PASSWORD,
        props: {
          password,
          loading: this.state.loading,
          next: this.submitPassword,
          updateValue: this.updateValue
        }
      },
      {
        show: VIEWS.EMAIL,
        props: {
          email,
          next: () => this.submitEmail(),
          submitted: emailSubmitted,
          updateValue: this.updateValue
        }
      },
      {
        show: VIEWS.INFO,
        props: {
          email,
          password,
          username,
          app,
          restoreEmailError: this.state.restoreEmailError,
          emailsSending: this.state.emailsSending,
          sendRestoreEmail: () => this.sendEmails('restore'),
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
          disableBackOnView={[0, VIEWS.INFO, views.length - 1]}
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
  localIdentities: PropTypes.array.isRequired,
  identityKeypairs: PropTypes.array.isRequired,
  registerName: PropTypes.func.isRequired,
  resetApi: PropTypes.func.isRequired,
  verifyAuthRequestAndLoadManifest: PropTypes.func.isRequired,
  encryptedBackupPhrase: PropTypes.string,
  notify: PropTypes.func.isRequired,
  connectStorage: PropTypes.func.isRequired
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Onboarding)
)
