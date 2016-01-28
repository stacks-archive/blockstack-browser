import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

class NotFoundPage extends Component {
  constructor() {
    super()
  }

  render() {
    return (
      <div>
        <h3>Page Not Found</h3>
        <hr />
        <p>
          <Link to="/" className="btn btn-primary">
            Go Home
          </Link>
        </p>
      </div>
    )
  }
}

export default NotFoundPage