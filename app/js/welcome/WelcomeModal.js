import React, { Component, PropTypes } from 'react'
import Modal from 'react-modal'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import Alert from '../components/Alert'
import InputGroup from '../components/InputGroup'
import { AccountActions } from '../account/store/account'
import { SettingsActions } from '../account/store/settings'
import { DROPBOX_APP_ID } from '../account/utils/dropbox'
import { isBackupPhraseValid } from '../utils'

import { PairBrowserView, LandingView, RestoreView } from './components'

const Dropbox = require('dropbox')

function mapStateToProps(state) {
  return {
    api: state.settings.api,
    promptedForEmail: state.account.promptedForEmail,
    encryptedBackupPhrase: state.account.encryptedBackupPhrase
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, AccountActions, SettingsActions), dispatch)
}

class WelcomeModal extends Component {
  static propTypes = {
    accountCreated: PropTypes.bool.isRequired,
    storageConnected: PropTypes.bool.isRequired,
    coreConnected: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
    updateApi: PropTypes.func.isRequired,
    api: PropTypes.object.isRequired,
    emailKeychainBackup: PropTypes.func.isRequired,
    promptedForEmail: PropTypes.bool.isRequired,
    encryptedBackupPhrase: PropTypes.string
  }

  constructor(props) {
    super(props)

    this.state = {
      accountCreated: this.props.accountCreated,
      storageConnected: this.props.storageConnected,
      coreConnected: this.props.coreConnected,
      password: '',
      backupPhrase: '',
      pageZeroView: 'friendly',
      pageOneView: 'getStarted',
      alerts: [],
      keychainProgress: 0,
      disableCreateAccountButton: false,
      email: ''
    }

    this.createAccount = this.createAccount.bind(this)
    this.restoreAccount = this.restoreAccount.bind(this)
    this.showCreateAccount = this.showCreateAccount.bind(this)
    this.showRestoreAccount = this.showRestoreAccount.bind(this)
    this.onValueChange = this.onValueChange.bind(this)
    this.connectDropbox = this.connectDropbox.bind(this)
    this.showGenerateKeychain = this.showGenerateKeychain.bind(this)
    this.showEnterPassword = this.showEnterPassword.bind(this)
    this.emailKeychainBackup = this.emailKeychainBackup.bind(this)
    this.skipEmailBackup = this.skipEmailBackup.bind(this)
    this.showFriendlyMode = this.showFriendlyMode.bind(this)
    this.showAdvancedMode = this.showAdvancedMode.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      accountCreated: nextProps.accountCreated,
      storageConnected: nextProps.storageConnected,
      coreConnected: nextProps.coreConnected
    })
  }

  createAccount(event)  {
    event.preventDefault()
    if (this.state.password.length) {
      this.setState({ disableCreateAccountButton: true })
      this.props.initializeWallet(this.state.password, null)
    }
    return false
  }

  createKeychain() {
    this.setState({pageOneView: 'create'})
  }

  showGenerateKeychain() {
    this.setState({pageOneView: 'generateKeychain'})
  }

  restoreAccount() {
    let { isValid, error } = isBackupPhraseValid(this.state.backupPhrase)

    if (!isValid) {
      this.updateAlert('danger', error)
      return
    }

    if (this.state.password.length) {
      this.props.initializeWallet(this.state.password, this.state.backupPhrase)
    } else {
      this.updateAlert('danger', 'Please enter a password must match')
    }
  }

  showCreateAccount(event)  {
    event.preventDefault()
    this.setState({pageOneView: 'create'})
  }

  showRestoreAccount(event)  {
    event.preventDefault()
    this.setState({pageOneView: 'restore'})
  }

  showEnterPassword(event) {
    event.preventDefault()
      this.setState({ keychainProgress: 100 })
    setTimeout(() => {
      this.setState({ pageOneView: 'enterPassword' })
    }, 1000)
  }

  showFriendlyMode(event) {
    event.preventDefault()
    this.setState({ pageZeroView: 'friendly' })
  }

  showAdvancedMode(event) {
    event.preventDefault()
    this.setState({ pageZeroView: 'advanced' })
  }

  emailKeychainBackup(event) {
    event.preventDefault()
    this.props.emailKeychainBackup(this.state.email, this.props.encryptedBackupPhrase)
    return false
  }

  skipEmailBackup(event) {
    event.preventDefault()
    this.props.skipEmailBackup()
  }

  connectDropbox() {
    const dbx = new Dropbox({ clientId: DROPBOX_APP_ID })
    const port = location.port === '' ? 80 : location.port
    window.location = dbx.getAuthenticationUrl(
      `http://localhost:${port}/account/storage`)
  }

  onValueChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  updateAlert(alertStatus, alertMessage) {
    this.setState({
      alerts: [{ status: alertStatus, message: alertMessage }]
    })
  }

  render() {
    const isOpen = !this.state.accountCreated ||
      !this.state.coreConnected || !this.props.promptedForEmail

    const needToPair = !this.state.coreConnected

    return (
      <div className="">
        <Modal
          isOpen={isOpen}
          onRequestClose={this.props.closeModal}
          contentLabel="This is My Modal"
          shouldCloseOnOverlayClick={false}
          style={{ overlay: { zIndex: 10 } }}
          className="container-fluid"
        >
          {needToPair ?
            <PairBrowserView />
          :
            <div>paired
            </div>
          }
        </Modal>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WelcomeModal)
