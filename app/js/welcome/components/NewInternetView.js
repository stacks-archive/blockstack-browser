import React, { PropTypes } from 'react'

const NewInternetView = (props) =>
  (
  <div>
    <h3 className="modal-heading m-t-15 p-b-10">
      Blockstack is a new internet designed for freedom & security
    </h3>
    <img
      role="presentation"
      src="/images/icon-new-internet.svg"
      className="m-b-15 m-t-15 welcome-modal-icon"
    />
    <div className="m-t-25">
      <button className="btn btn-primary btn-block m-b-20" onClick={props.showNextView}>
        Continue
      </button>
    </div>
  </div>
 )

NewInternetView.propTypes = {
  showNextView: PropTypes.func.isRequired
}

export default NewInternetView
