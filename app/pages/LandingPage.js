import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import Alert from '../components/Alert'
import * as KeychainActions from '../actions/keychain'
import InputGroup from '../components/InputGroup'

function mapStateToProps(state) {
  return {
    encryptedMnemonic: state.keychain.encryptedMnemonic
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(KeychainActions, dispatch)
}

class LandingPage extends Component {
  static propTypes = {
    initializeWallet: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      password: '',
      password2: '',
      alerts: []
    }

    this.updateAlert = this.updateAlert.bind(this)
    this.createAccount = this.createAccount.bind(this)
    this.onValueChange = this.onValueChange.bind(this)
  }

  updateAlert(alertStatus, alertMessage) {
    this.setState({
      alerts: [{ status: alertStatus, message: alertMessage }]
    })
  }

  createAccount() {
    if (this.state.password.length > 7) {
      if (this.state.password === this.state.password2) {
        this.updateAlert('success', 'Creating your account...')
        this.props.initializeWallet(this.state.password)
      } else {
        this.updateAlert('danger', 'Passwords must match')
      }
    } else {
      this.updateAlert('danger', 'Password must be at least 8 characters')
    }
  }

  onValueChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-md-6">
            <h3>Create Account</h3>

            { this.state.alerts.map(function(alert, index) {
              return (
                <Alert key={index} message={alert.message} status={alert.status} />
              )
            })}

            <InputGroup name="password" type="password" label="Password"
              placeholder="Password" data={this.state} onChange={this.onValueChange} />
            <InputGroup name="password2" type="password" label="Password (again)"
              placeholder="Password" data={this.state} onChange={this.onValueChange} />
            <div>
              <button className="btn btn-primary" onClick={this.createAccount}>
                Create
              </button>
            </div>
          </div>
          <div className="col-md-6">
            <h3>Restore Account</h3>
            <div className="form-group">
              <button className="btn btn-secondary">Restore</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LandingPage)
