import PropTypes from 'prop-types'
import React from 'react'

const CreateIdentityView = (props) =>
  (
  <div>
    <h3 className="modal-heading m-t-15 p-b-10">
      Blockstack has no 3rd parties: a keychain on your device gives you access
    </h3>
    <img
      role="presentation"
      src="/images/identity-key-on-device.svg"
      className="m-b-15 welcome-modal-icon"
    />
    <div className="m-t-25">
      <button className="btn btn-primary btn-block m-b-20" onClick={props.showNextView}>
        Continue
      </button>
    </div>
  </div>
 )

CreateIdentityView.propTypes = {
  showNextView: PropTypes.func.isRequired
}

export default CreateIdentityView
