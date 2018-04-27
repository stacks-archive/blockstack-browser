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
import { BLOCKSTACK_INC } from '../account/utils/index'
import { setCoreStorageConfig } from '@utils/api-utils'
import log4js from 'log4js'

const logger = log4js.getLogger('onboarding/index.js')

const VIEWS = {
  EMAIL: 0,
  EMAIL_VERIFY: 1,
  PASSWORD: 2,
  USERNAME: 3,
  HOORAY: 4
}

const HEROKU_URL = 'https://obscure-retreat-87934.herokuapp.com'

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
    email: state.account.email
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({},
    AccountActions, SettingsActions, IdentityActions),
    dispatch)
}

function sendRecovery(blockstackId, email, encryptedSeed) {
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

  return fetch(`${HEROKU_URL}/recovery`, options)
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

function sendRestore(blockstackId, email, encryptedSeed) {
  const { protocol, hostname, port } = location
  const thisUrl = `${protocol}//${hostname}${port && `:${port}`}`
  const restoreLink = `${thisUrl}/sign-in?seed=${encryptedSeed}`

  const options = {
    method: 'POST',
    body: JSON.stringify({
      email,
      restoreLink,
      blockstackId
    }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  }

  return fetch(`${HEROKU_URL}/restore`, options)
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

class Onboarding extends React.Component {
  state = {
    email: '',
    password: '',
    username: '',
    seed: '',
    emailSubmitted: false,
    view: VIEWS.EMAIL
  }

  componentWillMount() {
    const { location } = this.props
    if (location.query.verified) {
      this.setState({ email: location.query.verified })
      this.updateView(VIEWS.PASSWORD)
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

  updateValue = (key, value) => {
    this.setState({ [key]: value })
  }

  updateView = view => this.setState({ view })

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

    return fetch(`${HEROKU_URL}/verify`, options)
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
    return new Promise(resolve => {
      this.props.initializeWallet(password, null)
      resolve()
    })
    .then(() => {
        logger.debug('creating new identity')
        const firstIdentityIndex = 0
        const ownerAddress = this.props.identityAddresses[firstIdentityIndex]
        this.props.createNewIdentityWithOwnerAddress(firstIdentityIndex, ownerAddress)
        this.props.setDefaultIdentity(firstIdentityIndex)
        return
    })
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
      ).then(indexUrl => {
        logger.debug('connectStorage: storage initialized')
        const newApi2 = Object.assign({}, newApi, { storageConnected: true })
        this.props.updateApi(newApi2)
        this.props.storageIsConnected()
        logger.debug('connectStorage: storage configured')
      })
    })
  }

  submitUsername = () => {
    // const { password, email, username } = this.state

    // TODO: send name registration request

    this.updateView(VIEWS.HOORAY)
  }

  goToBackup = () => {
    browserHistory.push({
      pathname: '/seed',
      state: { seed: this.state.seed }
    })
  }

  submitEmailForVerification = () => {
    // Short-circuit email verification
    this.verifyEmail(this.state.email)
    .then(() => {
      this.updateView(VIEWS.PASSWORD)
    })

    // verifyEmail(this.state.email)
    // this.updateView(VIEWS.EMAIL_VERIFY)
  }

  render() {
    const { email, password, username, emailSubmitted, view } = this.state

    const views = [
      {
        show: VIEWS.EMAIL,
        Component: Email,
        props: {
          email,
          next: this.submitEmailForVerification,
          submitted: emailSubmitted,
          updateValue: this.updateValue
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
          updateValue: this.updateValue
        }
      },
      {
        show: VIEWS.HOORAY,
        Component: Hooray,
        props: {
          email,
          password,
          username,
          goToRecovery: this.goToBackup,
          goToApp: () => console.log('go to app!')
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
  storageIsConnected: PropTypes.func.isRequired
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Onboarding))
