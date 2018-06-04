import React from 'react'
import PropTypes from 'prop-types'

const ProfileCompletion = (props) => {
  const pct = props.completePct*100
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
              Complete your Blockstack ID by adding your name and a verified social account.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

ProfileCompletion.propTypes = {
  completePct: PropTypes.number.isRequired
}

export default ProfileCompletion
