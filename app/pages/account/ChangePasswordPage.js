import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { Alert, InputGroup, AccountSidebar } from '../../components/index'
import { KeychainActions } from '../../store/keychain'
import { decrypt, encrypt } from '../../utils/keychain-utils'

function mapStateToProps(state) {
  return {
    encryptedMnemonic: state.keychain.encryptedMnemonic
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(KeychainActions, dispatch)
}

class ChangePasswordPage extends Component {
  static propTypes = {
    encryptedMnemonic: PropTypes.string.isRequired,
    updateMnemonic: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      currentPassword: '',
      newPassword: '',
      newPassword2: '',
      alerts: []
    }

    this.updateAlert = this.updateAlert.bind(this)
    this.reencryptMnemonic = this.reencryptMnemonic.bind(this)
    this.onValueChange = this.onValueChange.bind(this)
  }

  updateAlert(alertStatus, alertMessage) {
    this.setState({
      alerts: [{
        status: alertStatus,
        message: alertMessage
      }]
    })
  }

  reencryptMnemonic() {
    const currentPassword = this.state.currentPassword,
          newPassword = this.state.newPassword,
          newPassword2 = this.state.newPassword2,
          dataBuffer = new Buffer(this.props.encryptedMnemonic, 'hex')

    decrypt(dataBuffer, currentPassword, (err, plaintextBuffer) => {
      if (!err) {
        if (newPassword.length < 8) {
          this.updateAlert('danger', 'New password must be at least 8 characters')
        } else {
          if (newPassword !== newPassword2) {
            this.updateAlert('danger', 'New passwords must match')
          } else {
            encrypt(plaintextBuffer, newPassword, (err, ciphertextBuffer) => {
              this.props.updateMnemonic(ciphertextBuffer.toString('hex'))
              this.updateAlert('success', 'Password updated!')
              this.setState({
                currentPassword: '',
                newPassword: '',
                newPassword2: ''
              })
            })
          }
        }
      } else {
        this.updateAlert('danger', 'Incorrect password')
      }
    })
  }

  onValueChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  render() {
    return (
      <div>
        <div className="page-header">
          <div className="container">
            <h1>Change Password</h1>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-md-3">
              <AccountSidebar />
            </div>
            <div className="col-md-9">
              <h3>Change Password</h3>
              { this.state.alerts.map(function(alert, index) {
                return (
                  <Alert key={index} message={alert.message} status={alert.status} />
                )
              })}
              <div>
                <InputGroup name="currentPassword" label="Current Password" type="password"
                  data={this.state} onChange={this.onValueChange} />
                <InputGroup name="newPassword" label="New Password" type="password"
                  data={this.state} onChange={this.onValueChange} />
                <InputGroup name="newPassword2" label="New Password" type="password"
                  data={this.state} onChange={this.onValueChange} />
                <div>
                  <button className="btn btn-primary" onClick={this.reencryptMnemonic}>
                    Update Password
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChangePasswordPage)
