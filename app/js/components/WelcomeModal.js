import React, { Component, PropTypes } from 'react'
import Modal from 'react-modal'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import InputGroup from '../components/InputGroup'
import { AccountActions } from '../store/account'

function mapStateToProps(state) {
  return {
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(AccountActions, dispatch)
}

class WelcomeModal extends Component {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      isOpen: this.props.isOpen,
      password: ''
    }

    this.createAccount = this.createAccount.bind(this)
    this.onValueChange = this.onValueChange.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      isOpen: nextProps.isOpen
    })
  }

  createAccount()  {
    if (this.state.password.length) {
      console.log('password saved') 
      this.props.initializeWallet(this.state.password, null)
      this.props.closeModal()
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
        <Modal
          isOpen={this.state.isOpen}
          onRequestClose={this.props.closeModal}
          contentLabel="This is My Modal"
          shouldCloseOnOverlayClick={false}
        >

          <h2>Welcome to Blockstack</h2>

          <h4>Step 1: Create an account</h4>

          <InputGroup name="password" label="Password" type="password"
            data={this.state} onChange={this.onValueChange} />

          <div className="container m-t-40">
            <button className="btn btn-primary" onClick={this.createAccount}>
              Create Account
            </button>
          </div>

        </Modal>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WelcomeModal)