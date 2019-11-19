import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import Alert from '@components/Alert'
import InputGroup from '@components/InputGroup'
import SimpleButton from '@components/SimpleButton'
import { AccountActions } from './store/account'
import { decrypt, encrypt } from '../utils'
import log4js from 'log4js'

const logger = log4js.getLogger(__filename)

function mapStateToProps(state) {
  return {
    encryptedBackupPhrase: state.account.encryptedBackupPhrase
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(AccountActions, dispatch)
}

class ChangePasswordPage extends Component {
  static propTypes = {
    encryptedBackupPhrase: PropTypes.string.isRequired,
    updateBackupPhrase: PropTypes.func.isRequired
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

  onValueChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  updateAlert(alertStatus, alertMessage) {
    logger.info(`updateAlert: alertStatus: ${alertStatus}, alertMessage ${alertMessage}`)
    this.setState({
      alerts: [
        {
          status: alertStatus,
          message: alertMessage
        }
      ]
    })
  }

  reencryptMnemonic() {
    logger.info('reencryptMnemonic')
    this.setState({
      isProcessing: true,
      alerts: []
    })

    const currentPassword = this.state.currentPassword
    const newPassword = this.state.newPassword
    const newPassword2 = this.state.newPassword2
    const dataBuffer = Buffer.from(this.props.encryptedBackupPhrase, 'hex')

    if (newPassword.length < 8) {
      this.updateAlert('danger', 'New password must be at least 8 characters')
      this.setState({ isProcessing: false })
      return
    } else if (newPassword !== newPassword2) {
      this.updateAlert('danger', 'New passwords must match')
      this.setState({ isProcessing: false })
      return
    }

    logger.debug('Trying to decrypt recovery phrase...')
    decrypt(dataBuffer, currentPassword).then(
      plaintextBuffer => {
        logger.debug('Recovery phrase successfully decrypted')
        logger.debug('Trying to re-encrypt recovery phrase with new password...')
        encrypt(plaintextBuffer, newPassword).then(ciphertextBuffer => {
          this.props.updateBackupPhrase(ciphertextBuffer.toString('hex'))
          this.updateAlert('success', 'Password updated!')
          this.setState({
            currentPassword: '',
            newPassword: '',
            newPassword2: '',
            isProcessing: false
          })
        })
      },
      () => {
        logger.error('Invalid password')
        this.updateAlert('danger', 'Incorrect password')
        this.setState({ isProcessing: false })
      }
    )
  }

  render() {
    return (
      <div className="m-b-100">
        <h3 className="container-fluid m-t-10">Change Password</h3>
        {this.state.alerts.map((alert, index) => (
          <Alert key={index} message={alert.message} status={alert.status} />
        ))}
        <div>
          <InputGroup
            name="currentPassword"
            label="Current Password"
            type="password"
            data={this.state}
            onChange={this.onValueChange}
          />
          <InputGroup
            name="newPassword"
            label="New Password"
            type="password"
            data={this.state}
            onChange={this.onValueChange}
          />
          <InputGroup
            name="newPassword2"
            label="New Password"
            type="password"
            data={this.state}
            onChange={this.onValueChange}
            onReturnKeyPress={this.reencryptMnemonic}
          />
          <div className="container-fluid m-t-40">
            <SimpleButton
              type="primary"
              onClick={this.reencryptMnemonic}
              loading={this.state.isProcessing}
              block
            >
              Update Password
            </SimpleButton>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChangePasswordPage)
