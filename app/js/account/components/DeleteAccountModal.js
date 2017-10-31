import React, { PropTypes } from 'react'
import Modal from 'react-modal'

const DeleteAccountModal = (props) => (
  <Modal
    className="container-fluid"
    contentLabel={props.contentLabel}
    isOpen={props.isOpen}
    onRequestClose={props.closeModal}
    portalClassName="delete-account-modal"
    style={{ overlay: { zIndex: 10 } }}
    shouldCloseOnOverlayClick={false}
  >
    <h3 className="modal-heading">Are you sure you want to reset your Blockstack Browser?</h3>
    <div className="modal-body">
      <p>
        Please make sure you have a written copy of your keychain phrase
        before continuing otherwise you will lose access to this keychain and any
        money or IDs associated with it.
      </p>
    </div>
    <div className="delete-account-buttons">
      <button
        className="btn btn-danger btn-block"
        onClick={props.deleteAccount}
      >
        Reset browser
      </button>
      <button
        onClick={props.closeModal}
        className="btn btn-secondary btn-block"
      >
        Cancel
      </button>
    </div>
  </Modal>
)

DeleteAccountModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  contentLabel: PropTypes.string.isRequired,
  closeModal: PropTypes.func.isRequired,
  deleteAccount: PropTypes.func.isRequired
}

export default DeleteAccountModal
