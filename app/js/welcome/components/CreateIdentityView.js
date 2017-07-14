import React, { PropTypes } from 'react'

const CreateIdentityView = (props) =>
  (
  <div>
    <h4>Blockstack has no 3rd parties: an identity key on your device gives you access</h4>
    <img
      src="/images/blockstack-logo-vertical-bug.svg"
      alt="Blockstack"
      style={{ width: '80%' }}
    />
    <div className="container m-t-40">
      <button className="btn btn-primary" onClick={props.showGenerateKeychain}>
        Create identity key
      </button>
    </div>
  </div>
 )

CreateIdentityView.propTypes = {
  showGenerateKeychain: PropTypes.func.isRequired,
  showRestoreAccount: PropTypes.func.isRequired
}

export default CreateIdentityView
