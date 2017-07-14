import React, { Component, PropTypes } from 'react'
import InputGroup from '../../components/InputGroup'


class ConfirmIdentityKeyView extends Component {
  static propTypes = {
    identityKeyPhrase: PropTypes.string.isRequired,
    showNextView: PropTypes.func.isRequired
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
        <h4>Re-enter your identity key to confirm you&#39;ve kept it in a safe place</h4>
        <p>Type your identity key here:</p>
        <InputGroup
          name="identityKeyPhrase"
          type="text"
          label="Identity key"
          placeholder="Identity key"
          data={this.state}
          onChange={this.onValueChange}
        />
        <div className="container m-t-40">
          <button className="btn btn-primary" onClick={this.props.showNextView}>
            Continue
          </button>
        </div>
      </div>
    )
  }
 }

export default ConfirmIdentityKeyView
