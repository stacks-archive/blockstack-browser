import React, { Component, PropTypes } from 'react'
import InputGroup from '../../components/InputGroup'


class EnterEmailView extends Component {
  static propTypes = {
    restoreAccount: PropTypes.func.isRequired,
    showGenerateKeychain: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      identityKeyPhrase: ''
    }
    this.onValueChange = this.onValueChange.bind(this)
  }

  onValueChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  render() {
    return (
      <div>
        <h4>Enter your email address to get useful notifications regarding your account</h4>
        <p>Type in your email address:</p>
        <InputGroup
          name="email"
          type="email"
          label="Identity key"
          placeholder="Identity key"
          data={this.state}
          onChange={this.onValueChange}
        />
        <div className="container m-t-40">
          <button className="btn btn-primary" onClick={this.props.restoreAccount}>
            Continue
          </button>
        </div>
      </div>
    )
  }
 }

export default EnterEmailView
