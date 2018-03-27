import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Onboarding from './Onboarding'
import Modal from 'react-modal'
import log4js from 'log4js'
import { bindActionCreators } from 'redux'
import { SettingsActions } from '../account/store/settings'
import { AppsActions } from '../store/apps'
import { SanityActions } from '../store/sanity'
import { CURRENT_VERSION } from '../store/reducers'
import '../utils/proxy-fetch'
import {
  getCoreAPIPasswordFromURL,
  getLogServerPortFromURL,
  getRegTestModeFromURL
} from '../utils/api-utils'
import { isCoreEndpointDisabled } from '../utils/window-utils'
import { openInNewTab } from '../utils'

const logger = log4js.getLogger('App.js')
export const BLOCKSTACK_STATE_VERSION_KEY = 'BLOCKSTACK_STATE_VERSION'

class OnboardingPage extends Component {
  static propTypes = {
    localIdentities: PropTypes.array.isRequired,
    defaultIdentity: PropTypes.number.isRequired,
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
    router: PropTypes.object.isRequired,
    instanceIdentifier: PropTypes.string
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
  }

  componentWillMount() {
    logger.trace('componentWillMount')
    const coreAPIPassword = getCoreAPIPasswordFromURL()
    const logServerPort = getLogServerPortFromURL()
    const regTestMode = getRegTestModeFromURL()
    let api = this.props.api

    // https://github.com/reactjs/react-modal/issues/133
    Modal.setAppElement('body')

    if (coreAPIPassword !== null) {
      api = Object.assign({}, api, { coreAPIPassword })
      this.props.updateApi(api)
    } else if (isCoreEndpointDisabled()) {
      logger.debug('Core-less build. Pretending to have a valid core connection.')
      api = Object.assign({}, api, { coreAPIPassword: 'PretendPasswordAPI' })
      this.props.updateApi(api)
    }

    if (logServerPort !== null) {
      api = Object.assign({}, api, { logServerPort })
      this.props.updateApi(api)
    }

    if (regTestMode !== null) {
      api = Object.assign({}, api, { regTestMode })
      this.props.updateApi(api)
    }

    if (!this.props.instanceIdentifier && this.props.localIdentities.length > 0) {
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

  onSupportClick = () => {
    openInNewTab('https://forum.blockstack.org/t/frequently-ask-questions/2123')
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
        <Onboarding
          accountCreated={this.state.accountCreated}
          storageConnected={this.state.storageConnected}
          coreConnected={this.state.coreConnected}
          closeModal={this.closeModal}
          needToUpdate={this.state.needToUpdate}
          router={this.props.router}
          onComplete={() => { console.log('ONBOARDING COMPLETED') }}
        />
      </div>
    )
  }
}

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
    instanceIdentifier: state.apps.instanceIdentifier
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({
  updateApi: SettingsActions.updateApi,
  isCoreRunning: SanityActions.isCoreRunning,
  isCoreApiPasswordValid: SanityActions.isCoreApiPasswordValid,
  generateInstanceIdentifier: AppsActions.generateInstanceIdentifier
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(OnboardingPage)
