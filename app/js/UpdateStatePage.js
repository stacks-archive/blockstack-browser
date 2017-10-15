import React, { Component, PropTypes } from 'react'
import Modal from 'react-modal'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Alert from './components/Alert'
import InputGroup from './components/InputGroup'
import { AccountActions } from './account/store/account'
import { decrypt } from './utils'

import log4js from 'log4js'

const logger = log4js.getLogger('UpdateStatePage.js')

function mapStateToProps(state) {
  return {
    api: state.settings.api,
    encryptedBackupPhrase: state.account.encryptedBackupPhrase
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({},
    AccountActions), dispatch)
}

class UpdateStatePage extends Component {
  static propTypes = {
    router: PropTypes.object.isRequired,
    api: PropTypes.object.isRequired,
    encryptedBackupPhrase: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      alert: null,
      password: '',
      upgradeInProgress: false
    }

    this.onValueChange = this.onValueChange.bind(this)
    this.upgradeBlockstackState = this.upgradeBlockstackState.bind(this)
    this.updateAlert = this.updateAlert.bind(this)
  }

  componentDidMount() {
    logger.trace('componentDidMount')
  }


  componentWillReceiveProps() {
    logger.trace('componentWillReceiveProps')
  }

  onValueChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  updateAlert(alertStatus, alertMessage) {
    this.setState({
      alert: { status: alertStatus, message: alertMessage }
    })
  }

  upgradeBlockstackState(event) {
    logger.trace('upgradeBlockstackState')
    event.preventDefault()
    this.setState({ upgradeInProgress: true })

    const encryptedBackupPhrase = this.props.encryptedBackupPhrase

    const dataBuffer = new Buffer(encryptedBackupPhrase, 'hex')
    const password = this.state.password
    decrypt(dataBuffer, password)
    .then((backupPhrase) => {

    })
    .catch((error) => {
      logger.error('upgradeBlockstackState: invalid password', error)
      this.updateAlert('danger', 'Wrong password')
    })
  }

  render() {
    const alert = this.state.alert
    return (
      <Modal
        isOpen
        contentLabel="Add Username Modal"
        onRequestClose={this.closeModal}
        shouldCloseOnOverlayClick
        className="container-fluid"
        portalClassName="add-user-modal"
      >
        <div>
          {alert ?
            <Alert key="1" message={alert.message} status={alert.status} />
            :
            null
          }
          <h3 className="modal-heading">Finish upgrading Blockstack</h3>
          <p>Enter your password to finish upgrading Blockstack.</p>
          <form className="modal-form" onSubmit={this.upgradeBlockstackState}>
            <InputGroup
              name="password"
              type="password"
              label="Password"
              placeholder="Password"
              data={this.state}
              onChange={this.onValueChange}
              required
            />
            <div className="m-t-25 m-b-30">
              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={this.state.upgradeInProgress}
              >
                {this.state.upgradeInProgress ?
                  <span>Upgrading...</span>
                  :
                  <span>Finish</span>
                }
              </button>
            </div>
          </form>
        </div>
      </Modal>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UpdateStatePage)
