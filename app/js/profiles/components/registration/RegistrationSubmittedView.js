import React, { PropTypes } from 'react'
import { Link } from 'react-router'

const RegistrationSubmittedView = (props) => (
  <div>
    <h3 className="modal-heading">Registration submitted!</h3>

    <div className="modal-body">
      <p>You username, <strong>{props.routeParams.name}</strong>, should be ready
      to use within 4 hours.</p>
      <p>Please <strong>do not</strong> exit Blockstack, disconnect from the internet, or
      turn your computer off during this time.</p>
      <img
        role="presentation"
        src="/images/blockstack-logo-vertical.svg"
        className="m-b-20"
        style={{ width: '210px', display: 'block', marginRight: 'auto', marginLeft: 'auto' }}
      />
      <Link to="/profiles" className="btn btn-primary btn-block">I understand</Link>
    </div>
  </div>
 )

RegistrationSubmittedView.propTypes = {
  routeParams: PropTypes.object.isRequired
}

export default RegistrationSubmittedView
