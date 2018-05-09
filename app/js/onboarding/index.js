import React from 'react'
import { browserHistory, withRouter } from 'react-router'
import PropTypes from 'prop-types'
import PanelShell, { renderItems } from '@components/PanelShell'
import { Email, Verify, Password, Username, Hooray } from './views'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { AccountActions } from '../account/store/account'
import { IdentityActions } from '../profiles/store/identity'
import { SettingsActions } from '../account/store/settings'
import { connectToGaiaHub } from '../account/utils/blockstack-inc'
import { RegistrationActions } from '../profiles/store/registration'
import { BLOCKSTACK_INC } from '../account/utils/index'
import { setCoreStorageConfig } from '@utils/api-utils'
import { hasNameBeenPreordered } from '@utils/name-utils'
import { verifyAuthRequestAndLoadManifest } from 'blockstack'
import queryString from 'query-string'
import log4js from 'log4js'

const logger = log4js.getLogger('onboarding/index.js')

const VIEWS = {
  EMAIL: 0,
  EMAIL_VERIFY: 1,
  PASSWORD: 2,
  USERNAME: 3,
  HOORAY: 4
}

const SUBDOMAIN_SUFFIX = 'personal.id'
const SERVER_URL = 'https://browser-api.blockstack.org'

function mapStateToProps(state) {
  return {
    api: state.settings.api,
    updateApi: PropTypes.func.isRequired,
    promptedForEmail: state.account.promptedForEmail,
    encryptedBackupPhrase: state.account.encryptedBackupPhrase,
    localIdentities: state.profiles.identity.localIdentities,
    identityAddresses: state.account.identityAccount.addresses,
    identityKeypairs: state.account.identityAccount.keypairs,
    connectedStorageAtLeastOnce: state.account.connectedStorageAtLeastOnce,
    storageConnected: state.settings.api.storageConnected,
    email: state.account.email,
    registration: state.profiles.registration
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({},
    AccountActions, SettingsActions, IdentityActions, RegistrationActions),
    dispatch)
}

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
    view: VIEWS.EMAIL,
    usernameRegistrationInProgress: false
  }

  componentWillMount() {
    const { location } = this.props
    if (location.query.verified) {
      this.setState({ email: location.query.verified })
      this.updateView(VIEWS.PASSWORD)
    }
  }

  componentDidMount() {
    this.decodeAndSaveAuthRequest()
    if (!this.props.api.subdomains[SUBDOMAIN_SUFFIX]) {
      this.props.resetApi(this.props.api)
    }
  }

  componentWillReceiveProps(nextProps) {
    const { registration } = nextProps
    if (this.state.usernameRegistrationInProgress && registration.registrationSubmitted) {
      if (!this.state.emailsSent) {
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

  updateURL = view => {
    const historyChange = slug => {
      if (this.props.location.pathname !== `/sign-up/${slug}`) {
        return this.props.router.push(`/sign-up/${slug}`, this.state)
      } else {
        return null
      }
    }

    switch (view) {
      case VIEWS.EMAIL_VERIFY:
        return historyChange('verify')
      case VIEWS.PASSWORD:
        return historyChange('password')
      case VIEWS.USERNAME:
        return historyChange('username')
      case VIEWS.HOORAY:
        return historyChange('success')
      default:
        return null
    }
  }

  componentDidUpdate() {
    this.updateURL(this.state.view)
  }

  decodeAndSaveAuthRequest() {
    const queryDict = queryString.parse(this.props.location.search)
    if (queryDict.redirect !== null && queryDict.redirect !== undefined) {
      const searchString = queryDict.redirect.replace('/auth', '')
      const redirectQueryDict = queryString.parse(searchString)
      if (redirectQueryDict.authRequest !== null && redirectQueryDict.authRequest !== undefined) {
        const authRequest = redirectQueryDict.authRequest
        verifyAuthRequestAndLoadManifest(authRequest)
        .then(appManifest => {
          this.setState({
            authRequest,
            appManifest
          })
        }, () => {
          logger.error('verifyAuthRequestAndLoadManifest: invalid authentication request')
        }).catch((e) => {
          logger.error('verifyAuthRequestAndLoadManifest: error', e)
        })
      }
    }
  }

  updateValue = (key, value) => {
    this.setState({ [key]: value })
  }

  updateView = view => this.setState({ view })

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

  verifyEmail(email) {
    this.setState({ emailSubmitted: true })

    const { protocol, hostname, port } = location
    const thisUrl = `${protocol}//${hostname}${port && `:${port}`}`
    const emailVerificationLink = `${thisUrl}/sign-up?verified=${email}`

    const options = {
      method: 'POST',
      body: JSON.stringify({
        email,
        emailVerificationLink
      }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }

    return fetch(`${SERVER_URL}/verify`, options)
      .then(
        () => {
          console.log(`emailNotifications: sent ${email} an email verification`)
        },
        error => {
          this.setState({ emailSubmitted: false })
          console.log('emailNotifications: error', error)
        }
      )
      .catch(error => {
        console.log('emailNotifications: error', error)
        this.setState({ emailSubmitted: false })
      })
  }

  submitPassword = () => {
    const { username, email } = this.state
    if (username.length < 1) {
      this.setState({
        email
      })
    }

    logger.debug('creating account')
    this.createAccount(this.state.password)
      .then(() => this.connectStorage())
      .then(() => {
        this.updateView(VIEWS.USERNAME)
      })
  }

  createAccount(password) {
    const firstIdentityIndex = 0
    return this.props.initializeWallet(password, null)
    .then(() => {
      logger.debug('creating new identity')
      const ownerAddress = this.props.identityAddresses[firstIdentityIndex]
      return this.props.createNewIdentityWithOwnerAddress(firstIdentityIndex, ownerAddress)
    }).then(() => this.props.setDefaultIdentity(firstIdentityIndex))
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

  submitUsername = (username) => {
    console.log('about to submit username')
    const suffix = `.${SUBDOMAIN_SUFFIX}`
    username += suffix
    logger.trace('registerUsername')
    const nameHasBeenPreordered = hasNameBeenPreordered(username, this.props.localIdentities)
    if (nameHasBeenPreordered) {
      logger.error(`registerUsername: username '${username}' has already been preordered`)
    } else {
      this.setState({
        usernameRegistrationInProgress: true
      })
      logger.debug(`registerUsername: will try and register username: ${username}`)
      const address = this.props.identityAddresses[0]
      const identity = this.props.localIdentities[0]
      const keypair = this.props.identityKeypairs[0]
      this.props.registerName(this.props.api, username, identity,
        0, address, keypair)
    }
  }

  finish = () => {
    if (this.state.appManifest) {
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
      state: { seed: this.state.seed }
    })
  }

  sendEmails = () => {
    this.setState({ emailsSent: true })
    const username = this.state.username
    const email = this.state.email
    const encryptedBackupPhrase = this.props.encryptedBackupPhrase
    return Promise.all([
      this.sendRestore(username, email, encryptedBackupPhrase)
      // this.sendRecovery(username, email, encryptedBackupPhrase)
    ])
  }

  submitEmailForVerification = () => {
    // Skip email verification
    this.updateView(VIEWS.PASSWORD)

    // verifyEmail(this.state.email)
    // this.updateView(VIEWS.EMAIL_VERIFY)
  }

  render() {
    const { email, password, username, emailSubmitted, view } = this.state
    const icons = this.state.appManifest ? this.state.appManifest.icons : []
    const appIconURL = icons.length > 0 ? icons[0].src : ''
    const appName = this.state.appManifest ? this.state.appManifest.name : ''

    const views = [
      {
        show: VIEWS.EMAIL,
        Component: Email,
        props: {
          email,
          next: this.submitEmailForVerification,
          submitted: emailSubmitted,
          updateValue: this.updateValue,
          appIconURL
        }
      },
      {
        show: VIEWS.EMAIL_VERIFY,
        Component: Verify,
        props: {
          email,
          resend: this.submitEmailForVerification,
          next: () => this.updateView(VIEWS.PASSWORD)
        }
      },
      {
        show: VIEWS.PASSWORD,
        Component: Password,
        props: {
          password,
          next: this.submitPassword,
          updateValue: this.updateValue
        }
      },
      {
        show: VIEWS.USERNAME,
        Component: Username,
        props: {
          username,
          next: this.submitUsername,
          previous: () => this.updateView(VIEWS.PASSWORD),
          updateValue: this.updateValue,
          isProcessing: this.state.usernameRegistrationInProgress
        }
      },
      {
        show: VIEWS.HOORAY,
        Component: Hooray,
        props: {
          email,
          password,
          username,
          appIconURL,
          appName,
          subdomainSuffix: SUBDOMAIN_SUFFIX,
          goToRecovery: this.goToBackup,
          finish: () => this.finish()
        }
      }
    ]

    return <PanelShell>{renderItems(views, view)}</PanelShell>
  }
}

Onboarding.propTypes = {
  api: PropTypes.object.isRequired,
  location: PropTypes.object,
  router: PropTypes.object,
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
  encryptedBackupPhrase: PropTypes.string
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Onboarding))
