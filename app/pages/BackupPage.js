import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import Alert from '../components/Alert'
import InputGroup from '../components/InputGroup'
import { KeychainActions } from '../store/keychain'
import { decrypt } from '../utils/keychain-utils'

function mapStateToProps(state) {
  return {
    encryptedMnemonic: state.keychain.encryptedMnemonic
  }
}

class BackupPage extends Component {
  static propTypes = {
    encryptedMnemonic: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      decryptedMnemonic: null,
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
    this.setState({
      alerts: [{ status: alertStatus, message: alertMessage }]
    })
  }

  decryptBackupPhrase() {
    const password = this.state.password,
          dataBuffer = new Buffer(this.props.encryptedMnemonic, 'hex')
    decrypt(dataBuffer, password, (err, plaintextBuffer) => {
      if (!err) {
        this.updateAlert('success', 'Backup phrase decrypted')
        this.setState({
          decryptedMnemonic: plaintextBuffer.toString()
        })
      } else {
        this.updateAlert('danger', 'Invalid password')
      }
    })
  }

  render() {
    return (
      <div>
        <div>
          <h3>Backup Account</h3>
          { this.state.alerts.map(function(alert, index) {
            return (
              <Alert key={index} message={alert.message} status={alert.status} />
            )
          })}
          {
            this.state.decryptedMnemonic ?
            <div>
              <p>
                <i>
                  Write down the backup phrase below and keep it safe.
                  Anyone who has it will be able to regain access to your account.
                </i>
              </p>
              <div className="highlight">
                <pre>
                  <code>{this.state.decryptedMnemonic}</code>
                </pre>
              </div>
            </div>
            :
            <div>
              <p>
                <i>Enter your password to view your backup phrase and backup your account.</i>
              </p>
              <InputGroup name="password" label="Password" type="password"
                data={this.state} onChange={this.onChange} />
              <div>
                <button className="btn btn-primary" onClick={this.decryptBackupPhrase}>
                  Decrypt Backup Phrase
                </button>
              </div>
            </div>
          }

        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps)(BackupPage)
