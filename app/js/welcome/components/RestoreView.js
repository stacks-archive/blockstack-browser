import PropTypes from 'prop-types'
import React, { Component } from 'react'
import InputGroup from '../../components/InputGroup'
import zxcvbn from 'zxcvbn'

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
      disableRestoreButton: false,
      pwStrength: null,
      passwordConfirmation: null
    }
    this.onValueChange = this.onValueChange.bind(this)
    this.restoreAccountSubmit = this.restoreAccountSubmit.bind(this)
    this.displayPasswordStrength = this.displayPasswordStrength.bind(this)
  }

  onValueChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
    if (event.target.name === 'password') {
      if (event.target.value === '') {
        this.setState({
          pwStrength: null
        })
      } else {
        const zxcvbnScore = zxcvbn(event.target.value).score
        this.setState({
          pwStrength: zxcvbnScore
        })
      }
    }
  }

  restoreAccountSubmit(event) {
    event.preventDefault()
    logger.trace('restoreAccountSubmit')

    this.props.restoreAccount(this.state.identityKeyPhrase,
      this.state.password,
      this.state.passwordConfirmation)
    .then(null, () => this.setState({ disableRestoreButton: false }))
  }

  displayPasswordStrength() {
    switch (this.state.pwStrength) {
      case 0:
      case 1:
      case 2:
        return <p className="label-red">The password you entered is very weak</p>
      case 3:
        return <p className="label-amber">The password you entered is average</p>
      case 4:
        return <p className="label-green">The password you entered is strong</p>
      default:
        return null
    }
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
          {this.displayPasswordStrength()}
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
