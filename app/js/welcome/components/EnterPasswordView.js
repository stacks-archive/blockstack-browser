import React, { Component, PropTypes } from 'react'
import InputGroup from '../../components/InputGroup'

import log4js from 'log4js'

const logger = log4js.getLogger('welcome/components/EnterPasswordView.js')

class EnterPasswordView extends Component {
  static propTypes = {
    createAccount: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      password: '',
      disableContinueButton: false
    }
    this.onValueChange = this.onValueChange.bind(this)
    this.createAccount = this.createAccount.bind(this)
  }

  onValueChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  createAccount(event) {
    logger.trace('createAccount')
    event.preventDefault()
    if (this.state.password.length) {
      this.setState({ disableContinueButton: true })
      this.props.createAccount(this.state.password)
    }
  }

  render() {
    return (
      <div>
        <form onSubmit={this.createAccount}>
          <h4>Choose a password to encrypt your keychain</h4>
          <p>The keychain on this device will be encrypted with your
          password. Later you will have the chance to backup the keychain
          itself.</p>
          <InputGroup
            name="password"
            label="Password"
            type="password"
            data={this.state}
            onChange={this.onValueChange}
            required
          />
          <div className="container m-t-40">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={this.state.disableContinueButton}
            >
              {this.state.disableContinueButton ?
                <span>Saving...</span>
                :
                <span>Save password</span>
              }
            </button>
          </div>
        </form>
      </div>
    )
  }
 }

export default EnterPasswordView
