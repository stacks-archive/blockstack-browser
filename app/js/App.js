import './utils/proxy-fetch'
import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { AccountActions } from './account/store/account'
import { IdentityActions } from './profiles/store/identity'
import { SettingsActions } from './account/store/settings'
import { AuthActions } from './auth/store/auth'
import WelcomeModal from './welcome/WelcomeModal'
import TrustLevelFooter from './components/TrustLevelFooter'
import { getCoreAPIPasswordFromURL, getLogServerPortFromURL } from './utils/api-utils'
import { MAX_TRUST_LEVEL } from './utils/account-utils'
import { SanityActions }    from './store/sanity'
import { CURRENT_VERSION } from './store/reducers'


import log4js from 'log4js'

const logger = log4js.getLogger('App.js')

const BLOCKSTACK_STATE_VERSION_KEY = 'BLOCKSTACK_STATE_VERSION'

function mapStateToProps(state) {
  return {
    localIdentities: state.profiles.identity.localIdentities,
    defaultIdentity: state.profiles.identity.default,
    encryptedBackupPhrase: state.account.encryptedBackupPhrase,
    api: state.settings.api,
    corePingUrl: state.settings.api.corePingUrl,
    coreApiRunning: state.sanity.coreApiRunning,
    coreApiPasswordValid: state.sanity.coreApiPasswordValid,
    walletPaymentAddressUrl: state.settings.api.walletPaymentAddressUrl,
    coreAPIPassword: state.settings.api.coreAPIPassword,
    instanceIdentifier: state.auth.instanceIdentifier
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({},
    AccountActions,
    SanityActions,
    SettingsActions,
    IdentityActions,
    AuthActions,
  ), dispatch)
}

class App extends Component {
  static propTypes = {
    localIdentities: PropTypes.array.isRequired,
    defaultIdentity: PropTypes.number.isRequired,
    children: PropTypes.element.isRequired,
    encryptedBackupPhrase: PropTypes.string,
    api: PropTypes.object.isRequired,
    updateApi: PropTypes.func.isRequired,
    corePingUrl: PropTypes.string.isRequired,
    coreApiRunning: PropTypes.bool.isRequired,
    coreApiPasswordValid: PropTypes.bool.isRequired,
    isCoreRunning: PropTypes.func.isRequired,
    isCoreApiPasswordValid: PropTypes.func.isRequired,
    generateInstanceIdentifier: PropTypes.func.isRequired,
    walletPaymentAddressUrl: PropTypes.string.isRequired,
    coreAPIPassword: PropTypes.string,
    stateVersion: PropTypes.number,
    router: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)
    let existingVersion = localStorage.getItem(BLOCKSTACK_STATE_VERSION_KEY)
    
    if (!existingVersion) {
      logger.debug(`No BLOCKSTACK_STATE_VERSION_KEY. Setting to ${CURRENT_VERSION}.`)
      localStorage.setItem(BLOCKSTACK_STATE_VERSION_KEY, CURRENT_VERSION)
      existingVersion = CURRENT_VERSION
    }

    logger.debug(`EXISTING_VERSION: ${existingVersion}; CURRENT_VERSION:
      ${CURRENT_VERSION}`)

    let needToUpdate = false
    if (existingVersion < CURRENT_VERSION) {
      logger.debug('We need to update state. Need to check if on-boarding is open.')
      needToUpdate = true
    }

    this.state = {
      accountCreated: !!this.props.encryptedBackupPhrase,
      storageConnected: !!this.props.api.storageConnected,
      coreConnected: !!this.props.api.coreAPIPassword,
      password: '',
      currentPath: '',
      needToUpdate
    }

    this.closeModal = this.closeModal.bind(this)
    this.performSanityChecks = this.performSanityChecks.bind(this)
    this.getTrustLevel = this.getTrustLevel.bind(this)
    this.shouldShowTrustLevelFooter = this.shouldShowTrustLevelFooter.bind(this)
  }

  componentWillMount() {
    logger.trace('componentWillMount')
    const coreAPIPassword = getCoreAPIPasswordFromURL()
    const logServerPort = getLogServerPortFromURL()
    let api = this.props.api
    if (coreAPIPassword !== null) {
      api = Object.assign({}, api, { coreAPIPassword })
      this.props.updateApi(api)
    }

    if (logServerPort !== null) {
      api = Object.assign({}, api, { logServerPort })
      this.props.updateApi(api)
    }

    if (!this.props.instanceIdentifier) {
      this.props.generateInstanceIdentifier()
    }
  }

  componentWillReceiveProps(nextProps) {
    const nextPath = nextProps.router.location.pathname
    const currentPath = this.state.currentPath
    if (currentPath !== nextPath) {
      this.performSanityChecks()
    }

    if (this.props.coreApiRunning) {
      logger.debug('Sanity check: Core API endpoint is running!')
    } else {
      // TODO connect to future notification system here
      // alert('Sanity check: Error! Core API is NOT running!')
      logger.error('Sanity check: Error! Core API is NOT running!')
    }

    if (this.props.coreApiPasswordValid) {
      logger.debug('Sanity check: Core API password is valid!')
    } else {
      logger.error('Sanity check: Error! Core API password is wrong!')
    }
    this.setState({
      accountCreated: !!nextProps.encryptedBackupPhrase,
      storageConnected: !!nextProps.api.storageConnected,
      coreConnected: !!nextProps.api.coreAPIPassword,
      currentPath: nextPath
    })
  }

  getTrustLevel() {
    const identityIndex = this.props.defaultIdentity
    const identity = this.props.localIdentities[identityIndex]
    if (!identity) {
      return 0
    } else {
      return identity.trustLevel
    }
  }

  shouldShowTrustLevelFooter() {
    const trustLevel = this.getTrustLevel()
    const localIdentities = this.props.localIdentities
    if (localIdentities.length === 0) {
      return false
    } else if (trustLevel < MAX_TRUST_LEVEL) {
      return true
    } else {
      return false
    }
  }

  closeModal() {
    this.setState({ modalIsOpen: false })
  }

  performSanityChecks() {
    logger.trace('performSanityChecks')
    this.props.isCoreRunning(this.props.corePingUrl)
    this.props.isCoreApiPasswordValid(this.props.walletPaymentAddressUrl,
      this.props.coreAPIPassword)
  }

  render() {
    const defaultIdentityName = this.props.defaultIdentity
    const shouldShowTrustLevelFooter = this.shouldShowTrustLevelFooter()
    const trustLevel = this.getTrustLevel()
    const editProfileLink = `/profiles/${defaultIdentityName}/edit`

    return (
      <div className="body-main">
        <WelcomeModal
          accountCreated={this.state.accountCreated}
          storageConnected={this.state.storageConnected}
          coreConnected={this.state.coreConnected}
          closeModal={this.closeModal}
          needToUpdate={this.state.needToUpdate}
          router={this.props.router}
        />
        <div className="wrapper footer-padding">
          {this.props.children}
        </div>
        {shouldShowTrustLevelFooter &&
          <TrustLevelFooter
            trustLevel={trustLevel}
            maxTrustLevel={MAX_TRUST_LEVEL}
            link={editProfileLink}
          />
        }
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)

/*
{
  (() => {
    if (process.env.NODE_ENV !== 'production') {
      //const DevTools = require('./components/DevTools')
      //return <DevTools />
    }
  })()
}
*/
