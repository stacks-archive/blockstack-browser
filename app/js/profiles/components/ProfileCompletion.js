import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

class ProfileCompletion extends Component {
  static propTypes = {
    completePct: PropTypes.number.isRequired,
  }

  render() {
    const pct = this.props.completePct*100
    return (
      <div className="container-fluid p-0 m-t-25">
        <div className="row">
          <div className="col">
            <div className="profile-completion m-b-20">
              <div className="m-b-30">
                <h2 className="font-weight-bold text-light">Step 2</h2>
                <p className="text-light">Complete your Blockstack ID by adding your name and proving at least one social account.</p>
              </div>
              <div className="progress">
                <div
                  className="progress-bar progress-bar-blue"
                  role="progressbar"
                  style={{width: `${pct}%`}}
                  aria-valuenow={`${pct}`}
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                  <span className={pct === 0 ? 'progress-bar-zero font-weight-bold' : ''}>
                    {`${pct}%`}
                  </span>
                </div>
              </div>
              <div className="profile-completion-sub m-t-30 text-light">
                Once you've completed your Blockstack ID by adding your name and proving your social account, you'll be able to register for the Blockstack Token Sale Voucher.
              </div>
              <a className="btn btn-block disabled btn-primary-disabled m-t-30 m-b-15" href="/">Login with Blockstack</a>
              <a className="btn btn-light-primary btn-block m-t-30 m-b-15" href="/">Login with Blockstack</a>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ProfileCompletion
