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
    <h3 className="modal-heading">Are you sure you want to remove your account?</h3>
    <div className="modal-body">
      <p>
        This will remove your account information from Blockstack.
        Please save your recovery phrase and password
        if you want to retrieve your account in the future.
      </p>
    </div>
    <div className="delete-account-buttons">
      <button
        onClick={props.closeModal}
        className="btn btn-secondary btn-block"
      >
        Cancel
      </button>
      <button
        className="btn btn-danger btn-block"
        onClick={props.deleteAccount}
      >
        Confirm
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
