import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

import { PageHeader } from '../../components/index'

class NotFoundPage extends Component {
  constructor() {
    super()
  }

  render() {
    return (
      <div className="body-inner body-inner-white">
        <PageHeader title="Page Not Found" />
        <div className="container">
          <p>
            <Link to="/" className="btn btn-primary">
              Go Home
            </Link>
          </p>
        </div>
      </div>
    )
  }
}

export default NotFoundPage