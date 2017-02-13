import React, { Component, PropTypes } from 'react'
import Modal from 'react-modal'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import InputGroup from '../components/InputGroup'
import { AccountActions } from '../store/account'
import { DROPBOX_APP_ID, getDropboxAccessTokenFromHash } from '../utils/storage/dropbox'

const Dropbox = require('dropbox')

function mapStateToProps(state) {
  return {
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(AccountActions, dispatch)
}

class WelcomeModal extends Component {
  static propTypes = {
    accountCreated: PropTypes.bool.isRequired,
    storageConnected: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      accountCreated: this.props.accountCreated,
      storageConnected: this.props.storageConnected,
      password: ''
    }

    this.createAccount = this.createAccount.bind(this)
    this.onValueChange = this.onValueChange.bind(this)
    this.connectDropbox = this.connectDropbox.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      accountCreated: nextProps.accountCreated,
      storageConnected: nextProps.storageConnected
    })
  }

  createAccount()  {
    if (this.state.password.length) {
      this.props.initializeWallet(this.state.password, null)
    }
  }

  connectDropbox() {
    const dbx = new Dropbox({ clientId: DROPBOX_APP_ID })
    window.location = dbx.getAuthenticationUrl(
      'http://localhost:3000/account/settings')
  }

  onValueChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  render() {
    const isOpen = !this.state.accountCreated || !this.state.storageConnected

    let page = 1
    if (this.state.accountCreated) {
      page = 2
    }

    return (
      <div className="">
        <Modal
          isOpen={isOpen}
          onRequestClose={this.props.closeModal}
          contentLabel="This is My Modal"
          shouldCloseOnOverlayClick={false}
          style={{overlay: {zIndex: 10}}}
          className="container-fluid"
        >
          <h2>Welcome to Blockstack</h2>
          { page === 1 ?
            <div>
              <h4>Step 1: Create an account</h4>
              <InputGroup name="password" label="Password" type="password"
                data={this.state} onChange={this.onValueChange} />
              <div className="container m-t-40">
                <button className="btn btn-primary" onClick={this.createAccount}>
                  Create Account
                </button>
              </div>
            </div>
          : null }
          { page === 2 ?
            <div>
              <h4>Step 2: Setup your storage</h4>
              <div className="container m-t-40">
                <button onClick={this.connectDropbox}
                  className="btn btn-sm btn-outline-primary">
                Connect Dropbox
                </button>
              </div>
            </div>
          : null }
        </Modal>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WelcomeModal)