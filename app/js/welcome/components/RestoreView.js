import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { isBackupPhraseValid } from '../../utils'
import InputGroup from '../../components/InputGroup'
import { AccountActions } from '../../account/store/account'
import Alert from '../../components/Alert'

import { DEFAULT_PASSWORD } from '../../utils/account-utils'


import log4js from 'log4js'

const logger = log4js.getLogger('welcome/components/RestoreView.js')


function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, AccountActions), dispatch)
}

class RestoreView extends Component {
  static propTypes = {
    showLandingView: PropTypes.func.isRequired,
    initializeWallet: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      identityKeyPhrase: '',
      alert: null
    }
    this.onValueChange = this.onValueChange.bind(this)
    this.restoreAccount = this.restoreAccount.bind(this)
    this.updateAlert = this.updateAlert.bind(this)
  }

  onValueChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  restoreAccount(event) {
    logger.trace('restoreAccount')
    event.preventDefault()
    const { isValid } = isBackupPhraseValid(this.state.identityKeyPhrase)

    if (!isValid) {
      logger.error('restoreAccount: invalid backup phrase entered')
      this.updateAlert('danger', 'The identity key you entered is not valid.')
      return
    }
    this.props.initializeWallet('password', this.state.identityKeyPhrase)
  }

  updateAlert(alertStatus, alertMessage) {
    this.setState({
      alert: { status: alertStatus, message: alertMessage }
    })
  }

  render() {
    const alert = this.state.alert
    return (
      <div>
        <h4>Restore your account by typing in your identity key</h4>
        <div>
            {alert ?
              <Alert key="1" message={alert.message} status={alert.status} />
              :
              null
            }
        </div>
        <p>Type your identity key here:</p>
        <InputGroup
          name="identityKeyPhrase"
          type="text"
          label="Identity key"
          placeholder="Identity key"
          data={this.state}
          onChange={this.onValueChange}
        />
        <div className="container m-t-40">
          <button className="btn btn-primary" onClick={this.restoreAccount}>
            Restore account
          </button>
          <br />
          <a href="#" onClick={this.props.showLandingView}>
            Create new account
          </a>
        </div>
      </div>
    )
  }
 }

export default connect(null, mapDispatchToProps)(RestoreView)
