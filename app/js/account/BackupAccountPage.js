import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Alert from '../components/Alert'
import InputGroup from '../components/InputGroup'
import { decrypt } from '../utils'
import log4js from 'log4js'

import { AccountActions } from './store/account'

const logger = log4js.getLogger('account/BackupAccountPage.js')

function mapStateToProps(state) {
  return {
    encryptedBackupPhrase: state.account.encryptedBackupPhrase
  }
}

function mapDispatchToProps(dispatch) {
  const actions = Object.assign({}, AccountActions)
  return bindActionCreators(actions, dispatch)
}

class BackupAccountPage extends Component {
  static propTypes = {
    encryptedBackupPhrase: PropTypes.string.isRequired,
    displayedRecoveryCode: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      decryptedBackupPhrase: null,
      password: '',
      alerts: []
    }

    this.onChange = this.onChange.bind(this)
    this.decryptBackupPhrase = this.decryptBackupPhrase.bind(this)
    this.updateAlert = this.updateAlert.bind(this)
  }

  onChange(event) {
    if (event.target.name === 'password') {
      this.setState({
        password: event.target.value
      })
    }
  }

  updateAlert(alertStatus, alertMessage) {
    logger.trace(`updateAlert: alertStatus: ${alertStatus}, alertMessage ${alertMessage}`)
    this.setState({
      alerts: [{ status: alertStatus, message: alertMessage }]
    })
  }

  decryptBackupPhrase() {
    logger.trace('decryptBackupPhrase')

    const password = this.state.password
    const dataBuffer = new Buffer(this.props.encryptedBackupPhrase, 'hex')
    logger.debug('Trying to decrypt recovery phrase...')
    decrypt(dataBuffer, password)
    .then((plaintextBuffer) => {
      logger.debug('Keychain phrase successfully decrypted')
      this.updateAlert('success', 'Keychain phrase decrypted')
      this.props.displayedRecoveryCode()
      this.setState({
        decryptedBackupPhrase: plaintextBuffer.toString()
      })
    }, (error) => {
      logger.error('Invalid password')
      this.updateAlert('danger', 'Invalid password')
    })
  }

  render() {

    return (
      <div>
        <div className="container-fluid">
          <div className="row">
            <div className="col">
              <h3>
                Backup Keychain
              </h3>
              {
                this.state.alerts.map((alert, index) => {
                  return (
                    <Alert key={index} message={alert.message} status={alert.status} />
                  )
                })
              }
            </div>
          </div>
        </div>
        {
          this.state.decryptedBackupPhrase ?
          <div className="container-fluid m-b-100">
            <div className="row">
              <div className="col">
                <p>
                  <i>
                    Write down the keychain phrase below and keep it safe.
                    Anyone who has it will be able to access to your keychain.
                  </i>
                </p>

                <div className="card">
                  <div className="card-header">
                    Keychain Phrase
                  </div>
                  <div className="card-block backup-phrase-container">
                    <p className="card-text">
                      {this.state.decryptedBackupPhrase}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          :
          <div className="container-fluid p-0 m-b-100">
            <div className="row">
              <div className="col">
                <p className="container-fluid">
                  <i>Enter your password to view your keychain phrase and write down your keychain phrase.</i>
                </p>
                <InputGroup
                  name="password" label="Password" type="password"
                  data={this.state} onChange={this.onChange}
                  onReturnKeyPress={this.decryptBackupPhrase}
                />
                <div className="container-fluid m-t-40">
                  <button className="btn btn-primary btn-block" onClick={this.decryptBackupPhrase}>
                    Display Keychain Phrase
                  </button>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BackupAccountPage)
