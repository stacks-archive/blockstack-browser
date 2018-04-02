import PropTypes from 'prop-types'
import React, { Component } from 'react'
import InputGroup from '@components/InputGroup'


class ConfirmIdentityKeyView extends Component {
  static propTypes = {
    confirmIdentityKeyPhrase: PropTypes.func.isRequired,
    showPreviousView: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      identityKeyPhrase: ''
    }
    this.onValueChange = this.onValueChange.bind(this)
    this.confirmIdentityKeyPhraseSubmit = this.confirmIdentityKeyPhraseSubmit.bind(this)
  }

  onValueChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  confirmIdentityKeyPhraseSubmit(event) {
    event.preventDefault()
    this.props.confirmIdentityKeyPhrase(this.state.identityKeyPhrase)
  }

  render() {
    const placeholder1 = 'apple banana orange cherry mango kiwi'
    const placeholder2 = 'grape watermelon strawberry lemon lime papaya'
    const placeholder = `${placeholder1} ${placeholder2}`
    return (
      <div>
        <h3 className="modal-heading">
          Re-enter your keychain phrase to confirm you&#39;ve kept it in a safe place
        </h3>
        <p className="modal-body">Type your keychain phrase here:</p>
        <form onSubmit={this.confirmIdentityKeyPhraseSubmit}>
          <InputGroup
            name="identityKeyPhrase"
            type="text"
            label="Keychain Phrase"
            placeholder={placeholder}
            data={this.state}
            onChange={this.onValueChange}
            required
            autoComplete="off"
          />
          <div style={{ marginBottom: '-20px' }}>
            <button
              type="submit"
              className="btn btn-primary btn-block m-b-10"
            >
              Continue
            </button>
            <p className="modal-body">
              <a href="#" className="modal-body" onClick={this.props.showPreviousView}>Back</a>
            </p>
          </div>
        </form>
      </div>
    )
  }
 }

export default ConfirmIdentityKeyView
