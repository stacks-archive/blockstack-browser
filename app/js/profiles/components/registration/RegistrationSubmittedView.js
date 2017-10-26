import React, { PropTypes } from 'react'
import { Link } from 'react-router'

const RegistrationSubmittedView = (props) => (
  <div>
    <h3 className="modal-heading">{props.routeParams.name} registration submitted!</h3>

    <div className="modal-body">
      <p>Please <strong>keep</strong> Blockstack online for the next hour. Your
      username will be available shortly after.</p>
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
