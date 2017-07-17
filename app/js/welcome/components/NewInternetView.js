import React, { PropTypes } from 'react'

const NewInternetView = (props) =>
  (
  <div>
    <h4>Blockstack is a new internet designed for freedom & security</h4>
    <img
      src="/images/blockstack-logo-vertical-bug.svg"
      alt="Blockstack"
      style={{ width: '80%' }}
    />
    <div className="container m-t-40">
      <button className="btn btn-primary" onClick={props.showNextView}>
        Continue
      </button>
    </div>
  </div>
 )

NewInternetView.propTypes = {
  showNextView: PropTypes.func.isRequired
}

export default NewInternetView
