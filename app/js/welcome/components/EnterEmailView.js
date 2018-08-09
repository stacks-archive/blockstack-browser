import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import InputGroup from '@components/InputGroup'
import { AccountActions } from '../../account/store/account'


function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, AccountActions), dispatch)
}

export class EnterEmailView extends Component {
  static propTypes = {
    emailNotifications: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      email: '',
      optIn: false
    }
    this.onToggle = this.onToggle.bind(this)
    this.onValueChange = this.onValueChange.bind(this)
    this.saveEmail = this.saveEmail.bind(this)
  }

  onToggle(event) {
    this.setState({
      [event.target.name]: event.target.checked
    })
  }

  onValueChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  saveEmail(event) {
    event.preventDefault()
    this.props.emailNotifications(this.state.email, this.state.optIn)
  }

  render() {
    const optIn = this.state.optIn
    return (
      <div>
        <h3 className="modal-heading">
          Enter your email address
        </h3>
        <form onSubmit={this.saveEmail}>
          <InputGroup
            name="email"
            type="email"
            label="Email Address"
            placeholder="Email Address"
            data={this.state}
            onChange={this.onValueChange}
            required
          />
          <div className="form-check">
            <label
              className="form-check-label"
              style={{
                marginBottom: '1em'
              }}
            >
              <input
                name="optIn"
                checked={optIn}
                onChange={this.onToggle}
                type="checkbox"
                className="form-check-input"
              />
              Join the Blockstack mailing list
            </label>
          </div>
          <div style={{ marginBottom: '-20px' }}>
            <button
              type="submit"
              className="btn btn-primary btn-block m-b-10"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    )
  }
 }

export default connect(null, mapDispatchToProps)(EnterEmailView)
