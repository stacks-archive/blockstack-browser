import React from 'react'
import PropTypes from 'prop-types'
import { decrypt, isBackupPhraseValid } from '@utils'
import PanelShell, { renderItems } from '@components/PanelShell'
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
import { EnterSeed, MagicLink, Options, Restore, Restored } from './views'
import log4js from 'log4js'

const logger = log4js.getLogger('sign-in/index.js')

const VIEWS = {
  INDEX: 0,
  MAGIC_LINK: 1,
  ENTER_SEED: 2,
  LOCAL_SEED: 3,
  RESTORE: 4,
  RESTORED: 5
}

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

class SignIn extends React.Component {
  state = {
    email: '',
    password: '',
    username: '',
    key: '',
    seed: '',
    encryptedSeed: '',
    decrypt: false,
    view: VIEWS.ENTER_SEED
  }

  componentWillMount() {
    const { location } = this.props
    if (location.query.seed) {
      this.setState({ encryptedSeed: location.query.seed })
      this.updateView(VIEWS.RESTORE)
    }
  }

  updateValue = (key, value) => {
    this.setState({ [key]: value })
  }

  updateView = view => this.setState({ view })

  backToSignUp = () => browserHistory.push({ pathname: '/sign-up' })

  isSeedEncrypted = key => !(key.split(' ').length === 12)

  validateRecoveryKey = () => {
    if (this.isSeedEncrypted(this.state.key)) {
      this.setState({
        encryptedSeed: this.state.key,
        decrypt: true
      }, () => this.updateView(VIEWS.RESTORE))
    } else {
      this.setState({
        seed: this.state.key
      }, () => this.updateView(VIEWS.RESTORE))
    }
  }

  decryptSeedAndRestore = () => {
    if (this.state.decrypt) {
      return decrypt(new Buffer(this.state.encryptedSeed, 'hex'), this.state.password)
        .then((decryptedSeedBuffer) => {
          const decryptedSeed = decryptedSeedBuffer.toString()
          this.setState({ seed: decryptedSeed }, this.restoreAccount)
        })
    } else {
      return this.restoreAccount()
    }
  }

  restoreAccount = () => this.restoreFromSeed()
      .then(() => this.createAccount())
      .then(() => this.connectStorage())
      .then(() => this.updateView(VIEWS.RESTORED))

  restoreFromSeed = () => {
    const seed = this.state.seed

    const { isValid } = isBackupPhraseValid(seed)

    if (!isValid) {
      logger.error('restoreAccount: invalid keychain phrase entered')
      return Promise.reject()
    }

    return this.props.initializeWallet(this.state.password, seed)
  }

  createAccount() {
    const firstIdentityIndex = 0
    logger.debug('creating new identity')
    const ownerAddress = this.props.identityAddresses[firstIdentityIndex]
    this.props.createNewIdentityWithOwnerAddress(firstIdentityIndex, ownerAddress)
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

    const views = [
      {
        show: VIEWS.INDEX,
        Component: Options,
        props: {
          options: [
            {
              title: 'Magic Link',
              description:
                'You’ll need your password (the password you entered when the link was created).',
              action: () => this.updateView(VIEWS.MAGIC_LINK)
            },
            {
              title: 'Secret Recovery Key',
              description:
                'You’ll need your Secret Recovery Key (the 12 words' +
                ' you wrote down on paper and then saved in a secret place).',
              action: () => this.updateView(VIEWS.ENTER_SEED)
            }
          ]
        }
      },
      {
        show: VIEWS.MAGIC_LINK,
        Component: MagicLink,
        props: {
          previous: () => this.backToSignUp()
        }
      },

      {
        show: VIEWS.ENTER_SEED,
        Component: EnterSeed,
        props: {
          previous: this.backToSignUp,
          next: this.validateRecoveryKey,
          updateValue: this.updateValue
        }
      },
      {
        show: VIEWS.RESTORE,
        Component: Restore,
        props: {
          previous: this.backToSignUp,
          next: this.decryptSeedAndRestore,
          updateValue: this.updateValue,
          decrypt: this.state.decrypt
        }
      },
      {
        show: VIEWS.RESTORED,
        Component: Restored,
        props: {
          next: () => this.props.router.push('/')
        }
      }
    ]

    return <PanelShell>{renderItems(views, view)}</PanelShell>
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

