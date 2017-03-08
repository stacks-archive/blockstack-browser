import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

class HomeButton extends Component {
  static propTypes = {
  }

  render() {
    return (
      <Link to="/" className="navbar-brand">
        <div className="btn-home-profiles">
          ‹ Home
        </div>
      </Link>
    )
  }
}

export default HomeButton