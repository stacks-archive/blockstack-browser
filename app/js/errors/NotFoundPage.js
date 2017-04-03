import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

import PageHeader from '../components/PageHeader'

class NotFoundPage extends Component {
  constructor() {
    super()
  }

  render() {
    return (
      <div className="body-inner bkg-white">
        <PageHeader title="Page Not Found" />
        <div className="container vertical-split-content">
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