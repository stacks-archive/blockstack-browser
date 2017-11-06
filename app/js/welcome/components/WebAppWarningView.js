import React, { PropTypes } from 'react'

const WebAppPage = (props) =>
  (
  <div>
    <img
      role="presentation"
      src="/images/blockstack-logo-vertical.svg"
      className="m-b-20"
      style={{
        width: '200px',
        display: 'block',
        marginRight: 'auto',
        marginLeft: 'auto',
        marginTop: '10px'
      }}
    />
    <h3 className="modal-heading p-b-25">
      This simple app allows you to explore Blockstack.
    </h3>
    <p className="modal-body">
      To experience the full feature set of the decentralized internet, <br />
      download the Blockstack app.
    </p>
    <div className="m-t-30 m-b-20 modal-body">
      <a className="btn btn-primary btn-block m-b-10" href="http://blockstack.org/install">
        Download Blockstack
      </a>
      <button className="btn btn-primary btn-block m-b-10" onClick={props.showLandingPage}>
        Continue with Webapp
      </button>
    </div>
  </div>
 )

WebAppPage.propTypes = {
  showLandingPage: PropTypes.func.isRequired
}

export default WebAppPage
