import React, { PropTypes } from 'react'

const NewInternetView = (props) =>
  (
  <div>    
    <h3 className="modal-heading m-t-15 p-b-20">Blockstack is a new internet designed for freedom & security</h3>
    <img src="/images/blockstack-logo-vertical.svg" className="m-b-20" style={{ width: '210px', display: 'block', marginRight: 'auto', marginLeft: 'auto' }} />
    <div className="m-t-55">
      <button className="btn btn-lg btn-primary btn-block m-b-20" onClick={props.showNextView}>
        Continue
      </button>
    </div>
  </div>
 )

NewInternetView.propTypes = {
  showNextView: PropTypes.func.isRequired
}

export default NewInternetView
