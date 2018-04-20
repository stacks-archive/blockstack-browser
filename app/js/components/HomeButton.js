import React from 'react'
import { Link } from 'react-router'

const HomeButton = () => (
  <Link to="/">
    <div className="btn-home-button">
      ‹ Home
    </div>
  </Link>
)

export default HomeButton
