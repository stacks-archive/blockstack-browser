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
    logger.debug('Trying to decrypt backup phrase...')
    decrypt(dataBuffer, password, (err, plaintextBuffer) => {
      if (!err) {
        logger.debug('Backup phrase successfully decrypted')
        this.updateAlert('success', 'Backup phrase decrypted')
        this.props.displayedRecoveryCode()
        this.setState({
          decryptedBackupPhrase: plaintextBuffer.toString()
        })
      } else {
        logger.error('Invalid password')
        this.updateAlert('danger', 'Invalid password')
      }
    })
  }

  render() {
    return (
      <div>
        {
          this.state.alerts.map((alert, index) => {
            return (
              <Alert key={index} message={alert.message} status={alert.status} />
            )
          })
        }
        {
          this.state.decryptedBackupPhrase ?
            <div>
              <p>
                <i>
                  Write down the backup phrase below and keep it safe.
                  Anyone who has it will be able to regain access to your account.
                </i>
              </p>

              <div className="card">
                <div className="card-header">
                  Backup Phrase
                </div>
                <div className="card-block">
                  <p className="card-text">
                    {this.state.decryptedBackupPhrase}
                  </p>
                </div>
              </div>
            </div>
          :
            <div>
              <p>
                <i>Enter your password to view your backup phrase and backup your account.</i>
              </p>
              <InputGroup
                name="password" label="Password" type="password"
                data={this.state} onChange={this.onChange}
              />
              <div className="container m-t-40">
                <button className="btn btn-primary" onClick={this.decryptBackupPhrase}>
                  Decrypt Backup Phrase
                </button>
              </div>
            </div>
        }
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BackupAccountPage)
