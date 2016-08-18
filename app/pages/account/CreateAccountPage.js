import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { Alert, InputGroup } from '../../components/index'
import { AccountActions } from '../../store/account'
import { SettingsActions } from '../../store/settings'
import { isPasswordValid } from '../../utils'

function mapStateToProps(state) {
  return {
    api: state.settings.api
  }
}

function mapDispatchToProps(dispatch) {
  let actions = Object.assign(AccountActions, SettingsActions)
  return bindActionCreators(actions, dispatch)
}

class CreateAccountPage extends Component {
  static propTypes = {
    api: PropTypes.object.isRequired,
    initializeWallet: PropTypes.func.isRequired,
    setAPICredentials: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      email: '',
      name: '',
      company: '',
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
    if (isPasswordValid(this.state.password).isValid) {
      if (this.state.password === this.state.password2) {

        this.props.setAPICredentials(this.props.api, this.state.email,
          this.state.name, this.state.company, (success) => {
          if (success) {
            this.updateAlert('success', 'Creating your account...')
            this.props.initializeWallet(this.state.password, this.state.email)
          } else {
            this.updateAlert('danger', 'Email already taken')
          }
        })
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
      <div className="body-inner draggable-page">
      <div className="container out-block-wrap">
        <div className="container-fluid out-block">
          <div className="row">
            <div className="centered">
              <div className="m-b-1">
                <img src="images/blockstack-rev.svg" alt="Blockstack logo" width="100px" />
                <p className="lead-out">browse the blockchain</p>
                <p className="lead-out m-b-1">image</p>
              </div>
            </div>
            <div>
              <div className="centered">
                <h1 className="text-xs-center type-inverse">create an account</h1>
              </div>
              <div className="out-form-group">
                { this.state.alerts.map(function(alert, index) {
                  return (
                    <Alert key={index} message={alert.message} status={alert.status} />
                  )
                })}
                <InputGroup type="text" name="name" label="Name" inverse={true}
                  placeholder="Name" data={this.state} onChange={this.onValueChange} />
                <InputGroup type="text" name="company" label="Company" inverse={true}
                  placeholder="Company" data={this.state} onChange={this.onValueChange} />
                <InputGroup type="email" name="email" label="Email" inverse={true}
                  placeholder="Email" data={this.state} onChange={this.onValueChange} />
                <InputGroup type="password" name="password" label="Password" inverse={true}
                  placeholder="Password" data={this.state} onChange={this.onValueChange} />
                <InputGroup type="password" name="password2" label="Password (again)" inverse={true}
                  placeholder="Password" data={this.state} onChange={this.onValueChange} />
                <div className="form-group">
                  <fieldset>
                    <div className="col-xs-offset-3 col-xs-8 pull-right m-t-11 m-b-5">
                      <button className="btn btn-block btn-secondary" onClick={this.createAccount}>
                        Create Account
                      </button>
                    </div>
                  </fieldset>
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm inverse text-xs-center">
                Already have an account?
                <br />
                <Link to="/account/restore">Restore from backup</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateAccountPage)
