import React, { PropTypes } from 'react'

const LandingPage = (props) =>
  (
  <div>
    <img
      src="/images/blockstack-logo-vertical-bug.svg"
      alt="Blockstack"
      style={{ width: '80%' }}
    />
    <p>Join the new internet.</p>
    <p>Use apps that put you in control.</p>
    <div className="container m-t-40">
      <button className="btn btn-primary" onClick={props.showGenerateKeychain}>
        Get Started
      </button>
      <br></br>
      <a href="#" onClick={props.showRestoreAccount}>
        Restore from backup
      </a>
    </div>
  </div>
 )

LandingPage.propTypes = {
  showGenerateKeychain: PropTypes.func.isRequired,
  showRestoreAccount: PropTypes.func.isRequired
}

export default LandingPage
