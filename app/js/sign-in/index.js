import React from 'react'
import PropTypes from 'prop-types'
import { decrypt, isBackupPhraseValid } from '@utils'
import { browserHistory, withRouter } from 'react-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { AccountActions } from '../account/store/account'
import { IdentityActions } from '../profiles/store/identity'
import { SettingsActions } from '../account/store/settings'
import { RegistrationActions } from '../profiles/store/registration'
import { trackEventOnce } from '@utils/server-utils'
import { Initial, Password, Success, Email } from './views'
import log4js from 'log4js'
import { AppHomeWrapper, ShellParent } from '@blockstack/ui'
import {
  selectConnectedStorageAtLeastOnce,
  selectEmail,
  selectEncryptedBackupPhrase,
  selectIdentityAddresses,
  selectPromptedForEmail
} from '@common/store/selectors/account'
import {
  selectDefaultIdentity,
  selectLocalIdentities,
  selectRegistration
} from '@common/store/selectors/profiles'
import {
  selectApi,
  selectStorageConnected
} from '@common/store/selectors/settings'
import {
  selectAppManifest,
  selectAuthRequest
} from '@common/store/selectors/auth'
import { AuthActions } from '../auth/store/auth'
import { formatAppManifest } from '@common'
import App from '../App'

const CREATE_ACCOUNT_IN_PROCESS = 'createAccount/in_process'

const logger = log4js.getLogger(__filename)
const VIEWS = {
  INITIAL: 0,
  PASSWORD: 1,
  EMAIL: 2,
  SUCCESS: 3
}
const VIEW_EVENTS = {
  [VIEWS.INITIAL]: 'Sign in - Initial',
  [VIEWS.EMAIL]: 'Sign in - Email',
  [VIEWS.PASSWORD]: 'Sign in - Password',
  [VIEWS.SUCCESS]: 'Sign in - Complete'
}

const views = [Initial, Password, Email, Success]

function mapStateToProps(state) {
  return {
    api: selectApi(state),
    appManifest: selectAppManifest(state),
    authRequest: selectAuthRequest(state),
    promptedForEmail: selectPromptedForEmail(state),
    encryptedBackupPhrase: selectEncryptedBackupPhrase(state),
    localIdentities: selectLocalIdentities(state),
    identityAddresses: selectIdentityAddresses(state),
    connectedStorageAtLeastOnce: selectConnectedStorageAtLeastOnce(state),
    storageConnected: selectStorageConnected(state),
    email: selectEmail(state),
    registration: selectRegistration(state),
    defaultIdentityIndex: selectDefaultIdentity(state)
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    Object.assign(
      {},
      AuthActions,
      AccountActions,
      SettingsActions,
      IdentityActions,
      RegistrationActions
    ),
    dispatch
  )
}

class SignIn extends React.Component {
  state = {
    password: '',
    key: '',
    email: null,
    encryptedKey:
      this.props.location &&
      this.props.location.query &&
      this.props.location.query.seed
        ? this.props.location.query.seed
        : '',
    decrypt: false,
    decrypting: false,
    decryptedKey: null,
    loading: false,
    restoreError: '',
    authRequest: null,
    view: VIEWS.INITIAL
  }

  componentWillMount() {
    if (this.props.encryptedBackupPhrase) {
      this.props.router.push('/')
    }
    const { location } = this.props
    if (location.query.seed) {
      this.setState({ encryptedKey: location.query.seed })
    }
    if (location.query.authRequest) {
      const authRequest = location.query.authRequest
      this.props.verifyAuthRequestAndLoadManifest(authRequest)
    }
  }

  componentDidMount() {
    this.trackViewEvent(this.state.view)
  }

  updateValue = (key, value) =>
    new Promise(resolve => {
      this.setState({ [key]: value }, () => {
        resolve()
      })
    })

  backToSignUp = () =>
    browserHistory.push(`/sign-up${document.location.search}`)

  isKeyEncrypted = key =>
    import(/* webpackChunkName: 'bip39' */ 'bip39').then(
      bip39 => !bip39.validateMnemonic(key)
    )

  validateRecoveryKey = async (key, nextView = VIEWS.PASSWORD) => {
    if (this.state.key !== key) {
      this.setState({ key })
    }
    if (await this.isKeyEncrypted(key)) {
      this.setState({
        encryptedKey: key,
        seed: '',
        decrypt: true
      })
    } else {
      this.setState({
        seed: key,
        encryptedKey: '',
        decrypt: false
      })
    }
    this.updateView(nextView)
  }

  decryptAndContinue = async () => {
    const { password, decrypting, encryptedKey } = this.state

    if (!password) {
      this.setState({ restoreError: 'Password is required' })
      return
    }

    if (this.state.decrypt && !decrypting) {
      this.setState({ decrypting: true })

      try {
        const decryptedKeyBuffer = await decrypt(
          new Buffer(encryptedKey, 'base64'),
          this.state.password
        )
        const decryptedKey = decryptedKeyBuffer.toString()
        this.setState(
          {
            key: decryptedKey,
            decrypting: false,
            restoreError: null
          },
          () => {
            this.updateView(VIEWS.EMAIL)
          }
        )
      } catch (e) {
        logger.debug(e)
        this.setState({
          decrypting: false,
          restoreError: 'Incorrect password or invalid recovery code',
          key: ''
        })
      }
    } else {
      this.updateView(VIEWS.EMAIL)
    }
  }

  restoreAccount = () => {
    logger.debug('Restoring account!')
    const { refreshIdentities, updateEmail } = this.props
    this.setState(
      {
        loading: true
      },
      () =>
        requestAnimationFrame(async () => {
          try {
            await this.createAccount()
            await refreshIdentities(
              this.props.api,
              this.props.identityAddresses
            )
            const identity = this.props.localIdentities[0]
            if (identity && identity.profile && identity.profile.api) {
              const newApi = {
                ...this.props.api,
                ...identity.profile.api
              }
              this.props.updateApi(newApi)
            }
            logger.debug('refreshIdentities complete')
            updateEmail(this.state.email)
            logger.debug('updated email')
            this.updateView(VIEWS.SUCCESS)
            logger.debug('navigate to success screen')
          } catch (e) {
            this.setState({
              loading: false,
              restoreError: 'There was an error loading your account.'
            })
          }
        })
    )
  }

  updateView = view => {
    this.setState({
      view,
      loading: false
    })
    this.trackViewEvent(view)
  }

  trackViewEvent = view => {
    const { appManifest } = this.props
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
   * new
   */

  /**
   * initialize our wallet
   * this will initialize our wallet and then create an account for us
   * see account/actions.js
   */
  async initializeWallet() {
    const { password, key } = this.state
    const { initializeWallet } = this.props
    console.log('initializeWallet')
    return initializeWallet(password, key)
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
   * This is our main function for creating a new account
   *
   * key: mnemonic
   */
  createAccount = async () => {
    const { key } = this.state
    logger.debug('creating account, createAccount()')

    const state = await isBackupPhraseValid(key)

    if (!state.isValid) {
      logger.error('restoreAccount: Invalid mnemonic phrase entered')
      return Promise.reject('Invalid recovery phrase entered')
    }

    this.setState({
      creatingAccountStatus: CREATE_ACCOUNT_IN_PROCESS
    })

    try {
      // Initialize our wallet
      await this.initializeWallet()
      // Create new ID and owner address and then set to default
      await this.createNewIdAndSetDefault()
      // Connect our default storage
      await this.props.connectStorage()
      // Account creation finished
      logger.debug('account creation done')
      return Promise.resolve()
    } catch (e) {
      return Promise.reject(e)
    }
  }

  /**
   * Redirect to Auth Request
   */
  redirectToAuth = () => {
    this.props.router.push(`/auth/?authRequest=${this.props.authRequest}`)
  }

  goToBackup = () => {
    browserHistory.push({
      pathname: '/seed',
      state: { seed: this.state.key, password: this.state.password }
    })
  }

  successNext = () => {
    if (this.props.appManifest && this.props.authRequest) {
      this.redirectToAuth()
    } else {
      this.props.router.push('/')
    }
  }

  render() {
    const { view, key = '', encryptedKey = '' } = this.state
    const notEmpty = v => v !== ''
    const value = (a, b) => (notEmpty(a) ? a : b)

    const user = this.props.localIdentities.length
      ? this.props.localIdentities[0]
      : {}
    const viewProps = [
      {
        show: VIEWS.INITIAL,
        props: {
          backView: this.backToSignUp,
          backLabel: 'Cancel',
          next: this.validateRecoveryKey,
          updateValue: this.updateValue,
          value: value(encryptedKey, key)
        }
      },
      {
        show: VIEWS.PASSWORD,
        props: {
          previous: () => this.updateView(VIEWS.INITIAL),
          next: this.decryptAndContinue,
          updateValue: this.updateValue
        }
      },
      {
        show: VIEWS.EMAIL,
        props: {
          previous: () => this.updateView(VIEWS.INITIAL),
          next: this.restoreAccount,
          updateValue: this.updateValue
        }
      },
      {
        show: VIEWS.SUCCESS,
        props: {
          id: user.ownerAddress,
          username: user.username ? user.username : '?',
          user,
          next: () => this.successNext(),
          goToRecovery: () => this.goToBackup()
        }
      }
    ]

    const currentViewProps = viewProps.find(v => v.show === view) || {}

    const componentProps = {
      view,
      backView: () => this.backView(),
      decrypt: this.state.decrypt,
      loading: this.state.loading,
      decrypting: this.state.decrypting,
      password: this.state.password,
      error: this.state.restoreError,
      key: this.state.key || this.state.decryptedKey,
      ...currentViewProps.props
    }
    return (
      <App>
        <ShellParent
          app={formatAppManifest(this.props.appManifest)}
          views={views}
          {...componentProps}
          disableBackOnView={views.length - 1}
        />
        <AppHomeWrapper />
      </App>
    )
  }
}

SignIn.propTypes = {
  api: PropTypes.object.isRequired,
  location: PropTypes.object,
  appManifest: PropTypes.object,
  authRequest: PropTypes.string,
  router: PropTypes.object,
  identityAddresses: PropTypes.array,
  createNewIdentityWithOwnerAddress: PropTypes.func.isRequired,
  setDefaultIdentity: PropTypes.func.isRequired,
  initializeWallet: PropTypes.func.isRequired,
  updateEmail: PropTypes.func.isRequired,
  refreshIdentities: PropTypes.func.isRequired,
  localIdentities: PropTypes.array.isRequired,
  encryptedBackupPhrase: PropTypes.string,
  connectStorage: PropTypes.func.isRequired,
  updateApi: PropTypes.func.isRequired
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SignIn)
)
