import React, { PropTypes } from 'react'

const ConnectStorageView = (props) =>
  (
  <div>
    <h3 className="modal-heading m-t-15 p-b-20">
      Connect a storage provider to store app data in a place you control
    </h3>
    <img
      role="presentation"
      src="/images/blockstack-logo-vertical.svg"
      className="m-b-20"
      style={{ width: '210px', display: 'block', marginRight: 'auto', marginLeft: 'auto' }}
    />
    <div className="m-t-40">
      <button className="btn btn-primary btn-block m-b-20" onClick={props.connectGaiaHub}>
        Connect Gaia Hub
      </button>
      <button className="btn btn-primary btn-block m-b-20" onClick={props.connectDropbox}>
        Connect Dropbox
      </button>
      <button className="btn btn-primary btn-block m-b-20" disabled title="Coming soon!">
        Connect IPFS
      </button>
      <button className="btn btn-primary btn-block m-b-20" disabled title="Coming soon!">
        Connect Self-hosted Drive
      </button>
    </div>
  </div>
 )

ConnectStorageView.propTypes = {
  connectDropbox: PropTypes.func.isRequired
}

export default ConnectStorageView
