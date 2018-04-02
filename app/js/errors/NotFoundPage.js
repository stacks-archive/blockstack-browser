import PropTypes from 'prop-types'
import React from 'react'
import { Link } from 'react-router'

import Navbar from '@components/Navbar'

const NotFoundPage = (props) =>
(
  <div className="app-wrap-profiles">
    <Navbar />
      {props.children}
    <div className="container-fluid m-t-50">
      <div className="row">
        <div className="col-12">
          <h1 style={{ textAlign: 'center' }}>Page not found</h1>
          <div className="avatar-md m-b-20 text-center">
            <Link to="/" className="btn btn-primary">
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  </div>
)

NotFoundPage.propTypes = {
  children: PropTypes.object.isRequired
}

export default NotFoundPage
