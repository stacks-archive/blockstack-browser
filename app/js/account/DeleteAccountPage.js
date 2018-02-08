import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import Alert from '../components/Alert'
import DeleteAccountModal from './components/DeleteAccountModal'
import { AccountActions } from './store/account'
import log4js from 'log4js'

const logger = log4js.getLogger('account/DeleteAccountPage.js')

function mapStateToProps(state) {
  return {
    coreAPIPassword: state.settings.api.coreAPIPassword,
    logServerPort: state.settings.api.logServerPort
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(AccountActions, dispatch)
}

class DeleteAccountPage extends Component {
  static propTypes = {
    coreAPIPassword: PropTypes.string.isRequired,
    logServerPort: PropTypes.string
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
    const coreAPIPassword = this.props.coreAPIPassword
    const logServerPort = this.props.logServerPort
    localStorage.clear()
    window.location = `/#coreAPIPassword=${coreAPIPassword}&logServerPort=${logServerPort}`
  }

  openModal() {
    logger.trace('deleteAccount')
    this.setState({ isOpen: true })
  }

  closeModal() {
    this.setState({ isOpen: false })
  }

  render() {
    return (
      <div className="m-b-100">
        <h3 className="container-fluid m-t-10">
          Reset Browser
        </h3>
        {
          this.state.alerts.map((alert, index) => (
            <Alert key={index} message={alert.message} status={alert.status} />
          ))
        }
        <div>
          <p className="container-fluid">
            <i>
              Erase your keychain and settings so you can create a new one or
              restore another keychain.
            </i>
          </p>
          <div className="container-fluid m-t-40">
            <button className="btn btn-danger btn-block" onClick={this.openModal}>
              Reset Browser
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
