import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import InputGroup from '../../components/InputGroup'
import { AccountActions } from '../../account/store/account'


import log4js from 'log4js'

const logger = log4js.getLogger('welcome/components/EnterPasswordView.js')


function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, AccountActions), dispatch)
}

class EnterPasswordView extends Component {
  static propTypes = {
    verifyPasswordAndCreateAccount: PropTypes.func.isRequired,
    deleteAccount: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      password: '',
      disableContinueButton: false
    }
    this.onValueChange = this.onValueChange.bind(this)
    this.enterPasswordSubmit = this.enterPasswordSubmit.bind(this)
  }

  componentDidMount() {
    logger.trace('componentDidMount')
    logger.debug('Deleting account from previous onboarding session.')
    this.props.deleteAccount()
  }

  onValueChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  enterPasswordSubmit(event) {
    logger.trace('createAccount')
    event.preventDefault()
    this.setState({ disableContinueButton: true })
    this.props.verifyPasswordAndCreateAccount(this.state.password, this.state.passwordConfirmation)
    .then(null, () => this.setState({ disableContinueButton: false }))
  }

  render() {
    return (
      <div>
        <h3 className="modal-heading">Choose a password to protect your keychain</h3>
        <p>Create a secure keychain by choosing a password</p>
        <form className="modal-form" onSubmit={this.enterPasswordSubmit}>
          <InputGroup
            name="password"
            type="password"
            label="Password"
            placeholder="Password"
            data={this.state}
            onChange={this.onValueChange}
            required
            enforcePasswordLength
          />
          <InputGroup
            name="passwordConfirmation"
            type="password"
            label="Confirm password"
            placeholder="Confirm password"
            data={this.state}
            onChange={this.onValueChange}
            required
            enforcePasswordLength
          />
          <div className="m-t-25 m-b-30">
            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={this.state.disableContinueButton}
            >
              {this.state.disableContinueButton ?
                <span>Saving...</span>
                :
                <span>Create keychain</span>
              }
            </button>
          </div>
        </form>
      </div>
    )
  }
 }

export default connect(null, mapDispatchToProps)(EnterPasswordView)
