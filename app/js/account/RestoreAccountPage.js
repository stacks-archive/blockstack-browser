import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import Alert from '../components/Alert'
import InputGroup from '../components/InputGroup'
import { AccountActions } from '../store/account'
import { isBackupPhraseValid } from '../utils'
import log4js from 'log4js'

const logger = log4js.getLogger('account/RestoreAccountPage.js')

function mapStateToProps(state) {
  return {
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(AccountActions, dispatch)
}

class RestorePage extends Component {
  static propTypes = {
    initializeWallet: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      backupPhrase: '',
      password: '',
      passwordConfirmation: '',
      alerts: []
    }

    this.updateAlert = this.updateAlert.bind(this)
    this.restoreAccount = this.restoreAccount.bind(this)
    this.onValueChange = this.onValueChange.bind(this)
  }

  onValueChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  updateAlert(alertStatus, alertMessage) {
    logger.trace(`updateAlert: alertStatus: ${alertStatus}, alertMessage ${alertMessage}`)
    this.setState({
      alerts: [{ status: alertStatus, message: alertMessage }]
    })
  }

  restoreAccount() {
    logger.trace('restoreAccount')
    const { isValid, error } = isBackupPhraseValid(this.state.backupPhrase)

    if (isValid) {
      if (this.state.password === this.state.passwordConfirmation) {
        this.updateAlert('success', 'Restoring your account...')
        localStorage.clear()
        this.props.initializeWallet(this.state.password, this.state.backupPhrase)
        this.updateAlert('success', 'Account restored.')
      } else {
        this.updateAlert('danger', 'Passwords must match')
      }
    } else {
      logger.error('Backup phrase invalid', error)
      this.updateAlert('danger', error)
    }
  }

  render() {
    return (
      <div>
        <p>
        Enter your backup phrase and choose a new password
         to restore your account. <i>This will delete your current account.</i>
        </p>
        { this.state.alerts.map(function(alert, index) {
          return (
            <Alert key={index} message={alert.message} status={alert.status} />
          )
        })}
        <InputGroup name="backupPhrase" type="text" label="Backup phrase"
          placeholder="Backup phrase" data={this.state} onChange={this.onValueChange} />
        <InputGroup name="password" type="password" label="New password"
          placeholder="Password" data={this.state} onChange={this.onValueChange} />
        <InputGroup name="passwordConfirmation" type="password" label="New password (again)"
          placeholder="Password" data={this.state} onChange={this.onValueChange} />
            <div className="container m-t-40">
              <button className="btn btn-primary" onClick={this.restoreAccount}>
                Restore
              </button>
            </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RestorePage)
