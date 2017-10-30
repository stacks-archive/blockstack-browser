import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

class ProfileCompletion extends Component {
  static propTypes = {
    completePct: PropTypes.number.isRequired,
  }

  render() {

    return (
      <div className="container-fluid m-t-50 p-0">
        <div className="row">
          <div className="col">
            <div className="profile-completion m-b-20">
              <div className="m-b-10">
                <span className="font-weight-bold">Profile Completion</span>
              </div>
              <div className="progress">
                <div 
                  className="progress-bar progress-blue" 
                  role="progressbar" 
                  style={{width: `${this.props.completePct*100}%`}} 
                  aria-valuenow={`${this.props.completePct*100}`}
                  aria-valuemin="0" 
                  aria-valuemax="100"
                >
                {`${this.props.completePct*100}%`}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ProfileCompletion
