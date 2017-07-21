import React, { PropTypes } from 'react'

const DataControlView = (props) =>
  (
  <div>
    <h3 className="modal-heading m-t-15 p-b-20">On Blockstack you’ll find apps that give you control over your data</h3>
    <img src="/images/blockstack-logo-vertical.svg" className="m-b-20" style={{ width: '210px', display: 'block', marginRight: 'auto', marginLeft: 'auto' }} />
    <div className="m-t-55">
      <button className="btn btn-primary btn-block m-b-20" onClick={props.showNextView}>
        Continue
      </button>
    </div>
  </div>
 )

DataControlView.propTypes = {
  showNextView: PropTypes.func.isRequired
}

export default DataControlView
