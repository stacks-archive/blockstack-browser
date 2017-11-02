import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

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
                <span className="font-weight-bold">Complete your ID</span>
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
                  <span className={pct === 0 ? 'progress-bar-zero' : ''}>
                    {`${pct}%`}
                  </span>
                </div>
              </div>
              <div className="profile-completion-sub m-t-10">
                Complete your Blockstack ID by adding a name, photo, short biography and verified social accounts.
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ProfileCompletion
