import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Onboarding from './Onboarding'
import log4js from 'log4js'
import { bindActionCreators } from 'redux'
import { SettingsActions } from '../account/store/settings'
import { AppsActions } from '../store/apps'
import { SanityActions } from '../store/sanity'
import { CURRENT_VERSION } from '../store/reducers'
import '../utils/proxy-fetch'
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
      currentPath: '',
      needToUpdate
    }

    this.performSanityChecks = this.performSanityChecks.bind(this)
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
      currentPath: nextPath
    })
  }

  onSupportClick = () => {
    openInNewTab('https://forum.blockstack.org/t/frequently-ask-questions/2123')
  }

  performSanityChecks() {
    logger.trace('performSanityChecks')
    this.props.isCoreRunning(this.props.corePingUrl)
    this.props.isCoreApiPasswordValid(this.props.walletPaymentAddressUrl,
      this.props.coreAPIPassword)
  }

  render() {
    const {
      encryptedBackupPhrase,
      api: { storageConnected, coreAPIPassword }
    } = this.props

    return (
      <div className="body-main">
        <Onboarding
          accountCreated={!!encryptedBackupPhrase}
          storageConnected={!!storageConnected}
          coreConnected={!!coreAPIPassword}
          needToUpdate={this.state.needToUpdate}
          router={this.props.router}
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
