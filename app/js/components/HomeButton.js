import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Link } from 'react-router'

class HomeButton extends Component {
  render() {
    return (
      <Link to="/">
        <div className="btn-home-button">
          ‹ Home
        </div>
      </Link>
    )
  }
}

export default HomeButton
