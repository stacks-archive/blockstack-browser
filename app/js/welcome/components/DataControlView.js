import React, { PropTypes } from 'react'

const DataControlView = (props) =>
  (
  <div>
    <h4>On Blockstack you’ll find apps that give you control over your data</h4>
    <img
      src="/images/blockstack-logo-vertical-bug.svg"
      alt="Blockstack"
      style={{ width: '80%' }}
    />
    <div className="container m-t-40">
      <button className="btn btn-primary" onClick={props.showGenerateKeychain}>
        Continue
      </button>
    </div>
  </div>
 )

DataControlView.propTypes = {
  showGenerateKeychain: PropTypes.func.isRequired,
  showRestoreAccount: PropTypes.func.isRequired
}

export default DataControlView
