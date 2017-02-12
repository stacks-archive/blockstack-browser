import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import {
  Alert, InputGroup, AccountSidebar, PageHeader
} from '../../components/index'
import { decrypt } from '../../utils'

function mapStateToProps(state) {
  return {
    encryptedBackupPhrase: state.account.encryptedBackupPhrase
  }
}

class BackupAccountPage extends Component {
  static propTypes = {
    encryptedBackupPhrase: PropTypes.string.isRequired
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
    this.setState({
      alerts: [{ status: alertStatus, message: alertMessage }]
    })
  }

  decryptBackupPhrase() {
    const password = this.state.password,
          dataBuffer = new Buffer(this.props.encryptedBackupPhrase, 'hex')
    decrypt(dataBuffer, password, (err, plaintextBuffer) => {
      if (!err) {
        this.updateAlert('success', 'Backup phrase decrypted')
        this.setState({
          decryptedBackupPhrase: plaintextBuffer.toString()
        })
      } else {
        this.updateAlert('danger', 'Invalid password')
      }
    })
  }

  render() {
    return (
      <div className="body-inner-white">
        <PageHeader title="Backup Account" />
        <div className="container vertical-split-content">
          <div className="row">
            <div className="col-md-3">
              <AccountSidebar activeTab="backup account" />
            </div>
            <div className="col-md-9">
              { this.state.alerts.map(function(alert, index) {
                return (
                  <Alert key={index} message={alert.message} status={alert.status} />
                )
              })}
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
                  <InputGroup name="password" label="Password" type="password"
                    data={this.state} onChange={this.onChange} />
                  <div className="container m-t-40">
                    <button className="btn btn-primary" onClick={this.decryptBackupPhrase}>
                      Decrypt Backup Phrase
                    </button>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps)(BackupAccountPage)
