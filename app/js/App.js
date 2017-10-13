import './utils/proxy-fetch'
import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { AccountActions } from './account/store/account'
import { IdentityActions } from './profiles/store/identity'
import { SettingsActions } from './account/store/settings'
import WelcomeModal from './welcome/WelcomeModal'
import TrustLevelFooter from './components/TrustLevelFooter'
import { getCoreAPIPasswordFromURL, getLogServerPortFromURL } from './utils/api-utils'
import { MAX_TRUST_LEVEL } from './utils/account-utils'
import { SanityActions }    from './store/sanity'

import log4js from 'log4js'

const logger = log4js.getLogger('App.js')

function mapStateToProps(state) {
  return {
    encryptedBackupPhrase: state.account.encryptedBackupPhrase,
    api: state.settings.api,
    corePingUrl: state.settings.api.corePingUrl,
    coreApiRunning: state.sanity.coreApiRunning,
    coreApiPasswordValid: state.sanity.coreApiPasswordValid,
    walletPaymentAddressUrl: state.settings.api.walletPaymentAddressUrl,
    coreAPIPassword: state.settings.api.coreAPIPassword,
    defaultIdentity: state.profiles.identity.default,
    localIdentities: state.profiles.identity.localIdentities
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({},
    AccountActions,
    SanityActions,
    SettingsActions,
    IdentityActions,
  ), dispatch)
}

class App extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    encryptedBackupPhrase: PropTypes.string,
    api: PropTypes.object.isRequired,
    updateApi: PropTypes.func.isRequired,
    corePingUrl: PropTypes.string.isRequired,
    coreApiRunning: PropTypes.bool.isRequired,
    coreApiPasswordValid: PropTypes.bool.isRequired,
    isCoreRunning: PropTypes.func.isRequired,
    isCoreApiPasswordValid: PropTypes.func.isRequired,
    walletPaymentAddressUrl: PropTypes.string.isRequired,
    coreAPIPassword: PropTypes.string
  }

  constructor(props) {
    super(props)

    this.state = {
      accountCreated: !!this.props.encryptedBackupPhrase,
      storageConnected: !!this.props.api.storageConnected,
      coreConnected: !!this.props.api.coreAPIPassword,
      password: '',
      currentPath: ''
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
    if (localIdentities.length == 0) {
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
