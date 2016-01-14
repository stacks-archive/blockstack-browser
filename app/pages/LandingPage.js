import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import Alert from '../components/Alert'
import * as KeychainActions from '../actions/keychain'
import InputGroup from '../components/InputGroup'

function mapStateToProps(state) {
  return {
    encryptedMnemonic: state.keychain.encryptedMnemonic
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(KeychainActions, dispatch)
}

class LandingPage extends Component {
  static propTypes = {
    initializeWallet: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      password: '',
      alertMessage: null,
      alertStatus: null
    }
    this.createAccount = this.createAccount.bind(this)
    this.onValueChange = this.onValueChange.bind(this)
  }

  createAccount() {
    if (this.state.password.length > 7) {
      this.setState({
        alertMessage: 'Great password! Creating your wallet now...',
        alertStatus: 'success'
      })
      this.props.initializeWallet(this.state.password)
    } else {
      this.setState({
        alertMessage: 'Password must be at least 8 characters',
        alertStatus: 'danger'
      })
    }
  }

  onValueChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-md-6 form-inline">
            <h2>Create Account</h2>

            { this.state.alertMessage ?
              <Alert message={this.state.alertMessage}
                status={this.state.alertStatus} />
            : null }

            <InputGroup name="password" type="password" label="" placeholder="Password"
              data={{password: this.state.password}}
              onChange={this.onValueChange} />
            &nbsp;&nbsp;
            <button className="btn btn-primary" onClick={this.createAccount}>Create</button>
          </div>
          <div className="col-md-6">
            <h3>Restore Account</h3>
            <div className="form-group">
              <button className="btn btn-secondary">Restore</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LandingPage)
