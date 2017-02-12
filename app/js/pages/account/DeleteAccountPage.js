import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import {
  Alert, InputGroup, AccountSidebar, PageHeader
} from '../../components/index'
import { AccountActions } from '../../store/account'
import { decrypt } from '../../utils'

function mapStateToProps(state) {
  return {
    encryptedBackupPhrase: state.account.encryptedBackupPhrase || ''
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(AccountActions, dispatch)
}

class DeleteAccountPage extends Component {
  static propTypes = {
    encryptedBackupPhrase: PropTypes.string.isRequired
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      password: '',
      alerts: []
    }

    this.updateAlert = this.updateAlert.bind(this)
    this.deleteAccount = this.deleteAccount.bind(this)
    this.onValueChange = this.onValueChange.bind(this)
  }

  updateAlert(alertStatus, alertMessage) {
    this.setState({
      alerts: [{ status: alertStatus, message: alertMessage }]
    })
  }

  deleteAccount() {
    const password = this.state.password,
          dataBuffer = new Buffer(this.props.encryptedBackupPhrase, 'hex')
    decrypt(dataBuffer, password, (err, plaintextBuffer) => {
      if (!err) {
        localStorage.clear()
        location.reload()
        //this.context.router.push('/landing')
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
      <div className="body-inner-white">
        <PageHeader title="Delete Account" />
        <div className="container vertical-split-content">
          <div className="row">
            <div className="col-md-3">
              <AccountSidebar activeTab="delete account" />
            </div>
            <div className="col-md-9">
              { this.state.alerts.map(function(alert, index) {
                return (
                  <Alert key={index} message={alert.message} status={alert.status} />
                )
              })}
              <div>
                <InputGroup name="password" label="Password" type="password"
                  data={this.state} onChange={this.onValueChange} />
                <div>
                  <button className="btn btn-primary" onClick={this.deleteAccount}>
                    Delete Account
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

export default connect(mapStateToProps, mapDispatchToProps)(DeleteAccountPage)
