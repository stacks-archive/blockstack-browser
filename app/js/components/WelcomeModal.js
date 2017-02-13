import React, { Component, PropTypes } from 'react'
import Modal from 'react-modal'
import InputGroup from '../components/InputGroup'

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

    this.savePassword = this.savePassword.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      isOpen: nextProps.isOpen
    })
  }

  savePassword()  {
    console.log('password saved') 
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

          <h2 ref="subtitle">Welcome to Blockstack</h2>

          <h4>Create an account</h4>

          <InputGroup name="password" label="Password" type="password"
            data={this.state} onChange={this.onValueChange} />

          <div className="container m-t-40">
            <button className="btn btn-primary" onClick={this.savePassword}>
              Save
            </button>
            &nbsp;
            <button className="btn btn-secondary" onClick={this.props.closeModal}>
              close
            </button>
          </div>

        </Modal>
      </div>
    )
  }
}

export default WelcomeModal