import React, { Component, PropTypes } from 'react'
import InputGroup from '../../components/InputGroup'

import log4js from 'log4js'

const logger = log4js.getLogger('welcome/components/RestoreView.js')


class RestoreView extends Component {
  static propTypes = {
    showLandingView: PropTypes.func.isRequired,
    restoreAccount: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      identityKeyPhrase: null,
      password: null,
      passwordConfirmation: null
    }
    this.onValueChange = this.onValueChange.bind(this)
    this.restoreAccountSubmit = this.restoreAccountSubmit.bind(this)
  }

  onValueChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  restoreAccountSubmit(event) {
    event.preventDefault()
    logger.trace('restoreAccountSubmit')
    this.props.restoreAccount(this.state.identityKeyPhrase,
      this.state.password,
      this.state.passwordConfirmation)
  }

  render() {
    return (
      <div>
        <h3 className="modal-heading">Restore your account by typing in your identity key</h3>
        <form className="modal-form" onSubmit={this.restoreAccountSubmit}>
          <InputGroup
            name="identityKeyPhrase"
            type="text"
            label="Type your identity key here"
            placeholder="Identity key"
            data={this.state}
            onChange={this.onValueChange}
            required
          />
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
          <div className="m-t-25">
            <button
              type="submit"
              className="btn btn-primary btn-block"
            >
              Restore account
            </button>
            <a href="#" className="modal-body" onClick={this.props.showLandingView}>
              Create new account
            </a>
          </div>
        </form>
      </div>
    )
  }
 }

export default RestoreView
