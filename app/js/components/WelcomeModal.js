import React, { Component, PropTypes } from 'react'
import Modal from 'react-modal'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import Alert from './Alert'
import InputGroup from './InputGroup'
import { AccountActions } from '../account/store/account'
import { SettingsActions } from '../account/store/settings'
import { DROPBOX_APP_ID } from '../storage/utils/dropbox'
import { isBackupPhraseValid } from '../utils'

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
    this.saveCoreAPIPassword = this.saveCoreAPIPassword.bind(this)
    this.showGenerateKeychain = this.showGenerateKeychain.bind(this)
    this.showEnterPassword = this.showEnterPassword.bind(this)
    this.emailKeychainBackup = this.emailKeychainBackup.bind(this)
    this.skipEmailBackup = this.skipEmailBackup.bind(this)
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
      `http://localhost:${port}/storage/providers`)
  }

  saveCoreAPIPassword(event) {
    event.preventDefault()
    let api = this.props.api
    api = Object.assign({}, api, { coreAPIPassword: this.state.coreAPIPassword })
    this.props.updateApi(api)
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

    let page = 0
    if (this.state.coreConnected) {
      page = 1
      if (this.state.accountCreated) {
        page = 2
      }
    }


    const pageOneView = this.state.pageOneView

    return (
      <div className="">
        <Modal
          isOpen={isOpen}
          onRequestClose={this.props.closeModal}
          contentLabel="This is My Modal"
          shouldCloseOnOverlayClick={false}
          style={{overlay: {zIndex: 10}}}
          className="container-fluid"
        >
          { page === 0 ?
            <div>
              <p className="m-b-30">Step 0: Enter your Blockstack Core API Password</p>
              <InputGroup label="Core API Password" name="coreAPIPassword" type="text"
                data={this.state} onChange={this.onValueChange} />
              <div>
                <button onClick={this.saveCoreAPIPassword}
                  className="btn btn-lg btn-primary btn-block">
                Save Core API Password
                </button>
              </div>
            </div>
          : null }
          { page === 1 ?
            <div>
              <div>
              { this.state.alerts.map(function(alert, index) {
                return (
                  <Alert key={index} message={alert.message} status={alert.status} />
                )
              })}
              </div>
            {pageOneView === 'getStarted' ?
              <div>
                <h4>Welcome to the new<br></br> decentralized internet</h4>
                <p>On Blockstack, there are no 3rd party servers with your identity or
                data. You are in control.</p>
                <img src="/images/blockstack-logo-vertical-bug.svg" style={{ width: '80%' }} />
                <div className="container m-t-40">
                  <button className="btn btn-primary" onClick={this.showGenerateKeychain}>
                    Get Started
                  </button>
                  <br></br>
                  <a href="#" onClick={this.showRestoreAccount}>
                    Restore Account
                  </a>
                </div>
              </div>
              :
              <div>
              {pageOneView === 'generateKeychain' ?
                <div>
                  <h4>Your keychain lets you unlock the new internet</h4>
                  <p>Traditional apps hold user keys on 3rd party servers
                  protected by weak sign in forms. On Blockstack, the keys are on
                  your device.</p>
                  <div className="progress">
                    <div className="progress-bar"
                    style={{ width: `${this.state.keychainProgress}%`,
                    backgroundColor: '#2275d7', height: '16px',
                    transition: 'width 1s ease-in-out' }}
                    role="progressbar"
                    aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
                    </div>
                  </div>
                  <div className="container m-t-40">
                    <button className="btn btn-primary" onClick={this.showEnterPassword}>
                      Create Keychain
                    </button>
                  </div>
                </div>
              :
                <div>
                  {pageOneView === 'enterPassword' ?
                    <div>
                      <form onSubmit={this.createAccount}>
                        <h4>Choose a password to encrypt your keychain</h4>
                        <p>The keychain on this device will be encrypted with your
                        password. Later you will have the chance to backup the keychain
                        itself.</p>
                        <InputGroup name="password" label="Password" type="password"
                          data={this.state} onChange={this.onValueChange}
                          required={true}
                        />
                        <div className="container m-t-40">
                          <button type="submit" className="btn btn-primary"
                          disabled={this.state.disableCreateAccountButton}
                          >
                            { this.state.disableCreateAccountButton ?
                              <span>Saving...</span>
                              :
                              <span>Continue</span>
                            }
                          </button>
                        </div>
                      </form>
                    </div>
                  :
                    <div>
                      <h4>Restore your account</h4>
                      <p></p>
                      <InputGroup name="backupPhrase" type="text" label="Backup phrase"
                        placeholder="Backup phrase" data={this.state} onChange={this.onValueChange} />
                      <InputGroup name="password" label="Password" type="password"
                        data={this.state} onChange={this.onValueChange} />
                      <div className="container m-t-40">
                        <button className="btn btn-primary" onClick={this.restoreAccount}>
                          Restore Account
                        </button>
                        <a href="#" onClick={this.showGenerateKeychain}>
                          Create Account
                        </a>
                      </div>
                    </div>
                  }
                </div>
              }
              </div>

              }
            </div>
          : null }
          { page === 2 ?
            <form onSubmit={this.emailKeychainBackup}>
              <h4>Enter your email to protect your keychain</h4>
              <p className="m-b-30">Enter your email to receive an encrypted copy
              of your keychain. This will help you recover your account if you lose
              your device.</p>
              <InputGroup name="email" label="Email address" type="email"
                data={this.state} onChange={this.onValueChange} required={true}
              />
              <div>
                <button
                  type="submit"
                  className="btn btn-lg btn-primary btn-block"
                >
                Finish
                </button>
                <br></br>
                <a href="#" onClick={this.skipEmailBackup}>
                  Skip
                </a>
              </div>
            </form>
          : null }
        </Modal>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WelcomeModal)
