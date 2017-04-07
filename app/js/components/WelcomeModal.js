import React, { Component, PropTypes } from 'react'
import Modal from 'react-modal'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import Alert from './Alert'
import InputGroup from './InputGroup'
import { AccountActions } from '../store/account'
import { SettingsActions } from '../store/settings'
import { DROPBOX_APP_ID, getDropboxAccessTokenFromHash } from '../storage/utils/dropbox'
import { isBackupPhraseValid } from '../utils'

const Dropbox = require('dropbox')

function mapStateToProps(state) {
  return {
    api: state.settings.api
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
    api: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      accountCreated: this.props.accountCreated,
      storageConnected: this.props.storageConnected,
      coreConnected: this.props.coreConnected,
      password: '',
      backupPhrase: '',
      pageOneView: 'create',
      alerts: []
    }

    this.createAccount = this.createAccount.bind(this)
    this.restoreAccount = this.restoreAccount.bind(this)
    this.showCreateAccount = this.showCreateAccount.bind(this)
    this.showRestoreAccount = this.showRestoreAccount.bind(this)
    this.onValueChange = this.onValueChange.bind(this)
    this.connectDropbox = this.connectDropbox.bind(this)
    this.saveCoreAPIPassword = this.saveCoreAPIPassword.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      accountCreated: nextProps.accountCreated,
      storageConnected: nextProps.storageConnected,
      coreConnected: nextProps.coreConnected
    })
  }

  createAccount()  {
    if (this.state.password.length) {
      this.props.initializeWallet(this.state.password, null)
    }
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
    const isOpen = !this.state.accountCreated || !this.state.storageConnected

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
          <h4>Welcome to Blockstack</h4>
          { page === 0 ?
            <div>
              <p className="m-b-30">Step 0: Enter your Blockstack Core API Password</p>
              <InputGroup name="coreAPIPassword" label="Core API Password" type="text"
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
            {  pageOneView === "create" ?
              <div>
                <p>Step 1: Create an account</p>
                <InputGroup name="password" label="Password" type="password"
                  data={this.state} onChange={this.onValueChange} />
                <div className="container m-t-40">
                  <button className="btn btn-primary" onClick={this.createAccount}>
                    Create Account
                  </button>
                  <a href="#" onClick={this.showRestoreAccount}>
                    Restore Account
                  </a>
                </div>
              </div>
              :
              <div>
                <p>Step 1: Restore an account</p>
                <InputGroup name="backupPhrase" type="text" label="Backup phrase"
                  placeholder="Backup phrase" data={this.state} onChange={this.onValueChange} />
                <InputGroup name="password" label="Password" type="password"
                  data={this.state} onChange={this.onValueChange} />
                <div className="container m-t-40">
                  <button className="btn btn-primary" onClick={this.restoreAccount}>
                    Restore Account
                  </button>
                  <a href="#" onClick={this.showCreateAccount}>
                    Create Account
                  </a>
                </div>
              </div>
              }
            </div>
          : null }
          { page === 2 ?
            <div>
              <p className="m-b-30">Step 2: Setup your storage</p>
              <div>
                <button onClick={this.connectDropbox}
                  className="btn btn-lg btn-primary btn-block">
                Connect Dropbox
                </button>
              </div>
            </div>
          : null }
        </Modal>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WelcomeModal)
