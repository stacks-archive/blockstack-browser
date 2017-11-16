import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

const registrationUrl = 'https://www.blockstack.com/register-from-blockstack-browser'

class ProfileCompletion extends Component {
  static propTypes = {
    completePct: PropTypes.number.isRequired,
  }

  render() {
    const pct = this.props.completePct*100
    return (
      <div className="container-fluid p-0">
        <div className="row">
          <div className="col">
            <div className="profile-completion m-b-20">
              <div className="m-b-10">
                <h3>Step 2: Complete Your Profile</h3>
              </div>
              <div className="profile-completion-sub m-t-10 m-b-20">
                Complete your Blockstack ID by adding your name and a verified social account.
              </div>
              <div className="progress progress-white">
                <div
                  className="progress-bar progress-bar-green"
                  role="progressbar"
                  style={{width: `${pct}%`}}
                  aria-valuenow={`${pct}`}
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                  <span className={pct === 0 ? 'progress-bar-zero' : ''}>
                    {`${pct}%`}
                  </span>
                </div>
              </div>
              <div className="profile-completion-sub m-t-20 m-b-20">
                Once complete, you'll be able to register 
                for the Blockstack Token Sale Voucher Wait List.
              </div>
              {pct === 100 ?
                <a href={registrationUrl} className="btn btn-sm btn-inverse btn-block">Continue to Wait List</a>
                :
                <button type="button" className="btn btn-sm btn-inverse btn-block btn-inverse-disabled">
                  Continue to Wait List
                </button>
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ProfileCompletion
