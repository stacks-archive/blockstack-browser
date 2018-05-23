import React from 'react'
import PropTypes from 'prop-types'
import { decrypt, isBackupPhraseValid } from '@utils'
import { browserHistory, withRouter } from 'react-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { AccountActions } from '../account/store/account'
import { IdentityActions } from '../profiles/store/identity'
import { SettingsActions } from '../account/store/settings'
import { connectToGaiaHub } from '../account/utils/blockstack-inc'
import { RegistrationActions } from '../profiles/store/registration'
import { BLOCKSTACK_INC } from '../account/utils/index'
import { setCoreStorageConfig } from '@utils/api-utils'
import { Initial, Password, Restoring, Success } from './views'
import log4js from 'log4js'
import { ShellParent } from '@blockstack/ui'
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
import { selectAppManifest } from '@common/store/selectors/auth'
import { formatAppManifest } from '@common'

const logger = log4js.getLogger('sign-in/index.js')

const VIEWS = {
  INITIAL: 0,
  PASSWORD: 1,
  RESTORING: 2,
  SUCCESS: 3
}

const views = [Initial, Password, Restoring, Success]

function mapStateToProps(state) {
  return {
    updateApi: PropTypes.func.isRequired,
    api: selectApi(state),
    appManifest: selectAppManifest(state),
    promptedForEmail: selectPromptedForEmail(state),
    encryptedBackupPhrase: selectEncryptedBackupPhrase(state),
    localIdentities: selectLocalIdentities(state),
    identityAddresses: selectIdentityAddresses(state),
    identityKeypairs: selectIdentityKeypairs(state),
    connectedStorageAtLeastOnce: selectConnectedStorageAtLeastOnce(state),
    storageConnected: selectStorageConnected(state),
    email: selectEmail(state),
    registration: selectRegistration(state)
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    Object.assign(
      {},
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
    email: '',
    password: '',
    username: '',
    key: '',
    seed: '',
    encryptedSeed: '',
    decrypt: false,
    restoring: false,
    restoreError: '',
    view: VIEWS.INITIAL
  }

  componentWillMount() {
    const { location } = this.props
    if (location.query.seed) {
      this.setState({ encryptedSeed: location.query.seed })
      this.updateView(VIEWS.RESTORING)
    }
  }

  updateValue = (key, value) => {
    this.setState({ [key]: value })
  }

  updateView = view => this.setState({ view })

  backToSignUp = () => browserHistory.push({ pathname: '/sign-up' })

  isSeedEncrypted = key => !(key.split(' ').length === 12)

  validateRecoveryKey = key => {
    if (this.state.key !== key) {
      this.setState({ key })
    }
    if (this.isSeedEncrypted(key)) {
      this.setState(
        {
          encryptedSeed: key,
          decrypt: true
        },
        () => this.updateView(VIEWS.PASSWORD)
      )
    } else {
      this.setState(
        {
          seed: key,
          decrypt: false,
          loading: true
        },
        () => this.updateView(VIEWS.RESTORING)
      )
    }
  }

  decryptSeedAndRestore = () => {
    this.setState({
      restoring: true,
      view: VIEWS.RESTORING
    })

    if (this.state.decrypt) {
      return decrypt(
        new Buffer(this.state.encryptedSeed, 'hex'),
        this.state.password
      )
        .then(decryptedSeedBuffer => {
          const decryptedSeed = decryptedSeedBuffer.toString()
          this.setState({ seed: decryptedSeed }, this.restoreAccount)
        })
        .catch(() => {
          this.setState({
            restoring: false,
            restoreError: 'The password you entered is incorrect.'
          })
        })
    } else {
      return this.restoreAccount()
    }
  }

  restoreAccount = () =>
    this.restoreFromSeed()
      .then(() => this.createAccount())
      .then(() => this.connectStorage())
      .then(() => this.updateView(VIEWS.SUCCESS))
      .catch(() => {
        this.setState({
          restoring: false,
          restoreError: 'There was an error restoring your account.'
        })
      })

  restoreFromSeed = () => {
    const { seed, password } = this.state
    const { initializeWallet } = this.props

    const { isValid } = isBackupPhraseValid(seed)

    if (!isValid) {
      logger.error('restoreAccount: Invalid keychain phrase entered')
      return Promise.reject('Invalid keychain phrase entered')
    }

    return initializeWallet(password, seed)
  }

  createAccount() {
    const firstIdentityIndex = 0
    logger.debug('creating new identity')
    const ownerAddress = this.props.identityAddresses[firstIdentityIndex]
    this.props.createNewIdentityWithOwnerAddress(
      firstIdentityIndex,
      ownerAddress
    )
    return this.props.setDefaultIdentity(firstIdentityIndex)
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
    const { view } = this.state

    const viewProps = [
      {
        show: VIEWS.INITIAL,
        props: {
          previous: this.backToSignUp,
          next: this.validateRecoveryKey,
          updateValue: this.updateValue
        }
      },
      {
        show: VIEWS.PASSWORD,
        props: {
          previous: () => this.updateView(VIEWS.INITIAL),
          next: this.decryptSeedAndRestore,
          updateValue: this.updateValue
        }
      },
      {
        show: VIEWS.RESTORING,
        props: {}
      },
      {
        show: VIEWS.SUCCESS,
        props: {
          next: () => this.props.router.push('/')
        }
      }
    ]

    const currentViewProps = viewProps.find(v => v.show === view) || {}

    const componentProps = {
      view,
      backView: () => this.backView(),
      decrypt: this.state.decrypt,
      restoring: this.state.restoring,
      restoreError: this.state.restoreError,
      ...currentViewProps.props
    }
    return (
      <ShellParent
        app={formatAppManifest(this.props.appManifest)}
        views={views}
        {...componentProps}
        headerLabel="Sign into Blockstack"
        invertOnLast
        backOnLast
      />
    )
  }
}

SignIn.propTypes = {
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
  encryptedBackupPhrase: PropTypes.string
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SignIn))
