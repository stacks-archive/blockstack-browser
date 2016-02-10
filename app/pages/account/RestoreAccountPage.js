import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { Alert, InputGroup } from '../../components/index'
import { KeychainActions } from '../../store/keychain'
import { isBackupPhraseValid } from '../../utils/account-utils'

function mapStateToProps(state) {
  return {
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(KeychainActions, dispatch)
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
      password2: '',
      alerts: []
    }

    this.updateAlert = this.updateAlert.bind(this)
    this.restoreAccount = this.restoreAccount.bind(this)
    this.onValueChange = this.onValueChange.bind(this)
  }

  updateAlert(alertStatus, alertMessage) {
    this.setState({
      alerts: [{ status: alertStatus, message: alertMessage }]
    })
  }

  restoreAccount() {
    let { isValid, error } = isBackupPhraseValid(this.state.backupPhrase)

    if (isValid) {
      if (this.state.password === this.state.password2) {
        this.updateAlert('success', 'Restoring your account...')
        this.props.initializeWallet(this.state.password, this.state.backupPhrase)
      } else {
        this.updateAlert('danger', 'Passwords must match')
      }
    } else {
      this.updateAlert('danger', error)
    }
  }

  onValueChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  render() {
    return (
      <div className="container">
        <div className="col-md-6 col-md-push-3">
          <h5>Restore Account</h5>
          { this.state.alerts.map(function(alert, index) {
            return (
              <Alert key={index} message={alert.message} status={alert.status} />
            )
          })}
          <InputGroup name="backupPhrase" type="text" label="Backup phrase"
            placeholder="Backup phrase" data={this.state} onChange={this.onValueChange} />
          <InputGroup name="password" type="password" label="New password"
            placeholder="Password" data={this.state} onChange={this.onValueChange} />
          <InputGroup name="password2" type="password" label="New password (again)"
            placeholder="Password" data={this.state} onChange={this.onValueChange} />
          <div>
            <button className="btn btn-primary" onClick={this.restoreAccount}>
              Restore
            </button>
          </div>
          <hr />
          <p>
            Don&#39;t have an account?
            <br />
            <Link to="/account/create">Create an account</Link>
          </p>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RestorePage)
