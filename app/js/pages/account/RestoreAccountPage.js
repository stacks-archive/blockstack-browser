import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { Alert, InputGroup } from '../../components/index'
import { AccountActions } from '../../store/account'
import { isBackupPhraseValid } from '../../utils'

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

  updateAlert(alertStatus, alertMessage) {
    this.setState({
      alerts: [{ status: alertStatus, message: alertMessage }]
    })
  }

  restoreAccount() {
    let { isValid, error } = isBackupPhraseValid(this.state.backupPhrase)

    if (isValid) {
      if (this.state.password === this.state.passwordConfirmation) {
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
      <div className="body-inner draggable-page">
      <div className="container vertical-split-content out-block-wrap">
        <div className="container-fluid out-block">
          <div className="row">
            <div className="centered">
              <div className="m-b-1">
                <img className="title-version m-t-1 m-b-1" src="/images/browser-beta-v1-0@2x.png"/>
              </div>
              <h1 className="text-xs-center type-inverse">restore from backup</h1>
              <p className="lead-out">
              Enter your backup phrase and choose a new password <br />
               to restore your account
              </p>
            </div>
            <div className="out-form-group">
              { this.state.alerts.map(function(alert, index) {
                return (
                  <Alert key={index} message={alert.message} status={alert.status} />
                )
              })}
              <InputGroup name="backupPhrase" type="text" label="Backup phrase" inverse={true}
                placeholder="Backup phrase" data={this.state} onChange={this.onValueChange} />
              <InputGroup name="password" type="password" label="New password" inverse={true}
                placeholder="Password" data={this.state} onChange={this.onValueChange} />
              <InputGroup name="passwordConfirmation" type="password" label="New password (again)" inverse={true}
                placeholder="Password" data={this.state} onChange={this.onValueChange} />
              <div className="form-group">
                <fieldset>
                  <div className="col-xs-offset-3 col-xs-8 pull-right m-t-11 m-b-5">
                    <button className="btn btn-block btn-secondary" onClick={this.restoreAccount}>
                      Restore
                    </button>
                  </div>
                </fieldset>
              </div>
              <div className="form-group">
                <fieldset>
                  <div className="col-xs-offset-3 col-xs-8 pull-right m-t-11">
                    <p className="text-sm inverse text-xs-center">Don&#39;t have an account?
                      <br />
                      <Link to="/account/create" className="view-out-link">Create an account</Link>
                    </p>
                  </div>
                </fieldset>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RestorePage)
