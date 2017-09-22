import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import Alert from 'js/components/Alert'
import InputGroup from 'js/components/InputGroup'
import DeleteAccountModal from './components/DeleteAccountModal'
import { AccountActions } from './store/account'
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
    encryptedBackupPhrase: PropTypes.string.isRequired,
    deleteAccount: PropTypes.func.isRequired
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      password: '',
      alerts: [],
      isOpen: false
    }

    this.updateAlert = this.updateAlert.bind(this)
    this.deleteAccount = this.deleteAccount.bind(this)
    this.onValueChange = this.onValueChange.bind(this)
    this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
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
    this.props.deleteAccount()
    this.closeModal()
  }

  openModal() {
    logger.trace('deleteAccount')
    const password = this.state.password
    const dataBuffer = new Buffer(this.props.encryptedBackupPhrase, 'hex')
    logger.debug('Trying to decrypt backup phrase...')
    decrypt(dataBuffer, password)
    .then(() => {
      this.setState({ isOpen: true })
    }, () => {
      this.updateAlert('danger', 'Incorrect password')
    })
  }

  closeModal() {
    this.setState({ isOpen: false })
  }

  render() {
    return (
      <div className="m-b-100">
        <h3 className="container-fluid m-t-10">
          Remove Account
        </h3>
        {
          this.state.alerts.map((alert, index) => (
            <Alert key={index} message={alert.message} status={alert.status} />
          ))
        }
        <div>
          <p className="container-fluid">
            <i>
              Remove your account from this browser so you can create a new one or
              restore another account.
            </i>
          </p>
          <InputGroup
            name="password" label="Password" type="password"
            data={this.state} onChange={this.onValueChange}
            onReturnKeyPress={this.openModal}
          />

          <div className="container-fluid m-t-40">
            <button className="btn btn-danger btn-block" onClick={this.openModal}>
              Remove Account
            </button>
          </div>
        </div>
        <DeleteAccountModal
          isOpen={this.state.isOpen}
          closeModal={this.closeModal}
          contentLabel="Modal"
          deleteAccount={this.deleteAccount}
        />
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DeleteAccountPage)
