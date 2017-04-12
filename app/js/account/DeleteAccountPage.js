import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import Alert from '../components/Alert'
import InputGroup from '../components/InputGroup'
import { AccountActions } from '../store/account'
import { decrypt } from '../utils'
import log4js from 'log4js'

const logger = log4js.getLogger('account/DeleteAccountPage.js')

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

  deleteAccount() {
    logger.trace('deleteAccount')
    const password = this.state.password
    const dataBuffer = new Buffer(this.props.encryptedBackupPhrase, 'hex')
    logger.debug('Trying to decrypt backup phrase...')
    decrypt(dataBuffer, password, (err) => {
      if (!err) {
        logger.debug('Backup phrase successfully decrypted')
        logger.debug('Clearing localStorage...')
        localStorage.clear()
        logger.trace('Reloading page...')
        location.reload()
      } else {
        this.updateAlert('danger', 'Incorrect password')
      }
    })
  }

  render() {
    return (
      <div>
        {
          this.state.alerts.map((alert, index) => {
            return (
              <Alert key={index} message={alert.message} status={alert.status} />
            )
          })}
        <div>
          <InputGroup
            name="password" label="Password" type="password"
            data={this.state} onChange={this.onValueChange}
          />
          <div className="container m-t-40">
            <button className="btn btn-primary" onClick={this.deleteAccount}>
              Delete Account
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DeleteAccountPage)
