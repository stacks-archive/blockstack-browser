import React, { PropTypes } from 'react'

const WriteDownkeyView = (props) =>
  (
  <div>
    <h3 className="modal-heading">Write down your identity key for account recovery -
    don’t show it to anyone</h3>
    <p className="modal-body">Identity key:</p>
    <p className="modal-body">{props.identityKeyPhrase}</p>
    <div className="container m-t-40">
      <button className="btn btn-lg btn-primary btn-block" onClick={props.showNextView}>
        I’ve written it down
      </button>
    </div>
  </div>
 )

WriteDownkeyView.propTypes = {
  identityKeyPhrase: PropTypes.string.isRequired,
  showNextView: PropTypes.func.isRequired
}

export default WriteDownkeyView
