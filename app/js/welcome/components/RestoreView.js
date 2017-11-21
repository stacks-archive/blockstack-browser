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
      passwordConfirmation: null,
      disableRestoreButton: false
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
    this.setState({ disableRestoreButton: true })
    this.props.restoreAccount(this.state.identityKeyPhrase,
      this.state.password,
      this.state.passwordConfirmation)
    .then(null, () => this.setState({ disableRestoreButton: false }))
  }

  render() {
    const placeholder1 = 'apple banana orange cherry mango kiwi'
    const placeholder2 = 'grape watermelon strawberry lemon lime papaya'
    const placeholder = `${placeholder1} ${placeholder2}`
    return (
      <div>
        <h3 className="modal-heading">Restore your keychain by typing in your keychain phrase</h3>
        <form className="modal-form" onSubmit={this.restoreAccountSubmit}>
          <InputGroup
            name="identityKeyPhrase"
            type="text"
            label="Type your keychain phrase here"
            placeholder={placeholder}
            data={this.state}
            onChange={this.onValueChange}
            required
            autoComplete="off"
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
          <div className="m-t-25 modal-body">
            <button
              type="submit"
              className="btn btn-primary btn-block m-b-10"
              disabled={this.state.disableRestoreButton}
            >
              {this.state.disableRestoreButton ?
                <span>Restoring...</span>
                :
                <span>Restore keychain</span>
              }
              
            </button>
            <a href="#" className="modal-body" onClick={this.props.showLandingView}>
              Create a new keychain
            </a>
          </div>
        </form>
      </div>
    )
  }
 }

export default RestoreView
