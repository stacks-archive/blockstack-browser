import React, { Component, PropTypes } from 'react'
import InputGroup from '../../components/InputGroup'


class RestoreView extends Component {
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
        <h4>Restore your account by typing in your identity key</h4>
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
          <button className="btn btn-primary" onClick={this.props.restoreAccount}>
            Restore account
          </button>
          <br />
          <a href="#" onClick={this.props.showGenerateKeychain}>
            Create new account
          </a>
        </div>
      </div>
    )
  }
 }

export default RestoreView
