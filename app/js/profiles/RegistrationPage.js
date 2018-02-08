import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Modal from 'react-modal'

const customContentStyles = {
  marginTop: 0,
  width: '615px'
}

const customOverlayStyles = {
  zIndex: 10
}

const customStyles = {
  content: customContentStyles,
  overlay: customOverlayStyles
}

class RegistrationPage extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)
    this.closeModal = this.closeModal.bind(this)
  }

  closeModal() {
    this.props.router.push('/profiles')
  }

  render() {
    return (
      <Modal
        isOpen
        contentLabel="Add Username Modal"
        onRequestClose={this.closeModal}
        shouldCloseOnOverlayClick
        style={customStyles}
        className="container-fluid"
        portalClassName="add-user-modal"
      >
        {this.props.children}
      </Modal>
   )
  }
}

export default RegistrationPage