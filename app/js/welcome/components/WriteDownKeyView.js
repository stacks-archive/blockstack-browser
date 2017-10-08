import React, { PropTypes } from 'react'

const WriteDownKeyView = (props) =>
(
  <div>
    <h3 className="modal-heading">Write down your identity key for account recovery -
    don’t show it to anyone</h3>
    <p className="modal-body m-b-0 m-t-25">Identity key:</p>
    <p className="modal-body modal-code">{props.identityKeyPhrase}</p>
    <div className="m-t-40">
      <button className="btn btn-primary btn-block m-b-10" onClick={props.showNextView}>
        I’ve written it down
      </button>
      <p className="modal-body">
        <a href="#" className="modal-body" onClick={props.showPreviousView}>Back</a>
      </p>
    </div>
  </div>
  )

WriteDownKeyView.propTypes = {
  identityKeyPhrase: PropTypes.string.isRequired,
  showNextView: PropTypes.func.isRequired,
  showPreviousView: PropTypes.func.isRequired
}

export default WriteDownKeyView
