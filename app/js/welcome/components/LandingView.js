import React, { PropTypes } from 'react'

const LandingPage = (props) =>
  (
  <div>
    <img src="/images/blockstack-logo-vertical.svg" className="m-b-20" style={{ width: '210px', display: 'block', marginRight: 'auto', marginLeft: 'auto' }} />
    <h3 className="modal-heading p-b-25">Join the new internet. <br />
      Use apps that put you in control.
    </h3>
    <div className="container m-t-40">
      <button className="btn btn-lg btn-primary btn-block" onClick={props.showNewInternetView}>
        Get Started
      </button>
      <br></br>
      <a href="#" className="modal-body" onClick={props.showRestoreView}>
        Restore from backup
      </a>
    </div>
  </div>
 )

LandingPage.propTypes = {
  showNewInternetView: PropTypes.func.isRequired,
  showRestoreView: PropTypes.func.isRequired
}

export default LandingPage
