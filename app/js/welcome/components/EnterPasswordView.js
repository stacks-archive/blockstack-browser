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
    this.enterPasswordSubmit = this.enterPasswordSubmit.bind(this)
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
    this.props.createAccount(this.state.password, this.state.passwordConfirmation)
    .then(null, () => this.setState({ disableContinueButton: false }))
  }

  render() {
    return (
      <div>
        <form onSubmit={this.enterPasswordSubmit}>
          <h4>Choose a password to protect your identity key</h4>
          <InputGroup
            name="password"
            type="password"
            label="Select a password"
            placeholder=""
            data={this.state}
            onChange={this.onValueChange}
            required
          />
          <InputGroup
            name="passwordConfirmation"
            type="password"
            label="Confirm password"
            placeholder=""
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
