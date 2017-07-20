import React, { PropTypes } from 'react'

const CreateIdentityView = (props) =>
  (
  <div>
    <h3 className="modal-heading m-t-15 p-b-20">Blockstack has no 3rd parties: an identity key on your device gives you access</h3>
    <img src="/images/blockstack-logo-vertical.svg" className="m-b-20" style={{ width: '210px', display: 'block', marginRight: 'auto', marginLeft: 'auto' }} />
    <div className="m-t-40">
      <button className="btn btn-lg btn-primary btn-block m-b-20" onClick={props.createAccount}>
        Create identity key
      </button>
    </div>
  </div>
 )

CreateIdentityView.propTypes = {
  createAccount: PropTypes.func.isRequired
}

export default CreateIdentityView
