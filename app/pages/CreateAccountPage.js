import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import Alert from '../components/Alert'
import { KeychainActions } from '../store/keychain'
import InputGroup from '../components/InputGroup'
import { isPasswordValid } from '../utils/account-utils'

function mapStateToProps(state) {
  return {
    encryptedMnemonic: state.keychain.encryptedMnemonic
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(KeychainActions, dispatch)
}

class CreateAccountPage extends Component {
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
    if (isPasswordValid(this.state.password)) {
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
        <div className="centered push-80">
          <h1>Chord</h1>
          <h4>The blockchain browser</h4>
        </div>
        <div className="row">
          <div className="col-md-6 col-md-push-3">
            <h5>Create Account</h5>
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
            <hr />
            <p>
              Already have an account?
              <br />
              <Link to="/account/restore">Restore from backup</Link>
            </p>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateAccountPage)
