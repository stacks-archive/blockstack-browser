import './utils/proxy-fetch'
import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { AccountActions } from './account/store/account'
import { SettingsActions } from './account/store/settings'
import WelcomeModal from './components/WelcomeModal'
import { getCoreAPIPasswordFromURL, getLogServerPortFromURL } from './utils/api-utils'
import { SanityActions }    from './store/sanity'

import log4js from 'log4js'

const logger = log4js.getLogger('App.js')

function mapStateToProps(state) {
  return {
    encryptedBackupPhrase: state.account.encryptedBackupPhrase,
    dropboxAccessToken: state.settings.api.dropboxAccessToken,
    api: state.settings.api,
    corePingUrl: state.settings.api.corePingUrl,
    coreApiRunning: state.sanity.coreApiRunning,
    coreApiPasswordValid: state.sanity.coreApiPasswordValid,
    walletPaymentAddressUrl: state.settings.api.walletPaymentAddressUrl,
    coreAPIPassword: state.settings.api.coreAPIPassword
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, AccountActions,
    SanityActions, SettingsActions), dispatch)
}

class App extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    encryptedBackupPhrase: PropTypes.string,
    dropboxAccessToken: PropTypes.string,
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
      accountCreated: this.props.encryptedBackupPhrase ? true : false,
      storageConnected: this.props.dropboxAccessToken ? true : false,
      coreConnected: this.props.api.coreAPIPassword ? true : false,
      password: '',
      currentPath: ''
    }

    this.closeModal = this.closeModal.bind(this)
    this.performSanityChecks = this.performSanityChecks.bind(this)
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
      logger.error('Sanity check: Error! Core API is NOT running!')
    }

    if (this.props.coreApiPasswordValid) {
      logger.debug('Sanity check: Core API password is valid!')
    } else {
      logger.error('Sanity check: Error! Core API password is wrong!')
    }
    this.setState({
      accountCreated: nextProps.encryptedBackupPhrase ? true : false,
      storageConnected: nextProps.dropboxAccessToken ? true : false,
      coreConnected: nextProps.api.coreAPIPassword ? true : false,
      currentPath: nextPath
    })
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
    return (
      <div className="body-main">
        <WelcomeModal
          accountCreated={this.state.accountCreated}
          storageConnected={this.state.storageConnected}
          coreConnected={this.state.coreConnected}
          closeModal={this.closeModal}
        />
        {this.props.children}
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
