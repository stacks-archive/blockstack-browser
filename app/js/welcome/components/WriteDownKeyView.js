import React, { PropTypes } from 'react'

const WriteDownkeyView = (props) =>
  (
  <div>
    <h4>Write down your identity key for account recovery -
    don’t show it to anyone</h4>
    <p>Identity key:</p>
    <p>{props.identityKeyPhrase}</p>
    <div className="container m-t-40">
      <button className="btn btn-primary" onClick={props.showNextView}>
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
