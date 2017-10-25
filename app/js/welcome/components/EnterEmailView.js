import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import InputGroup from '../../components/InputGroup'
import { AccountActions } from '../../account/store/account'


function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, AccountActions), dispatch)
}

class EnterEmailView extends Component {
  static propTypes = {
    emailNotifications: PropTypes.func.isRequired,
    skipEmailBackup: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      identityKeyPhrase: ''
    }
    this.onValueChange = this.onValueChange.bind(this)
    this.skip = this.skip.bind(this)
    this.saveEmail = this.saveEmail.bind(this)
  }

  onValueChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  saveEmail(event) {
    event.preventDefault()
    this.props.emailNotifications(this.state.email)
  }

  skip(event) {
    event.preventDefault()
    this.props.skipEmailBackup()
  }

  render() {
    return (
      <div>
        <h3 className="modal-heading">
          Enter your email address to get useful notifications about Blockstack
        </h3>
        <p className="modal-body">Type in your email address:</p>
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
          <div style={{ marginBottom: '-20px' }}>
            <button
              type="submit"
              className="btn btn-primary btn-block m-b-10"
            >
              Continue
            </button>
            <p className="modal-body">
              <a href="#" className="modal-body" onClick={this.skip}>Skip</a>
            </p>
          </div>
        </form>
      </div>
    )
  }
 }

export default connect(null, mapDispatchToProps)(EnterEmailView)
