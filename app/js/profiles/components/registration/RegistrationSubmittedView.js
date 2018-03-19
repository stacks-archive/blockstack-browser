import PropTypes from 'prop-types'
import React from 'react'
import { Link } from 'react-router'

const RegistrationSubmittedView = (props) => {
  const {
    routeParams: {
      name
    }
  } = props

  const bodyContent = <p>Your username will be ready in about an hour.</p>

  return (
    <div>
      <h3 className="modal-heading">{name} registration submitted!</h3>

      <div className="modal-body">
        {bodyContent}
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
}

RegistrationSubmittedView.propTypes = {
  routeParams: PropTypes.object.isRequired
}

export default RegistrationSubmittedView
