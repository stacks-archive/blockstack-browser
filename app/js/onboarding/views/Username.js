import React from 'react'
import PropTypes from 'prop-types'
import Navigation from '../components/Navigation'

const Username = ({ previous, next, handleValueChange, email, username }) => (
  <section>
    <h3>
      Username
    </h3>
    <input
      type="text"
      name="username"
      value={username}
      onChange={handleValueChange}
    />
    <Navigation
      previous={previous}
      next={next}
    />
  </section>
)

Username.propTypes = {
  previous: PropTypes.func.isRequired,
  next: PropTypes.func.isRequired,
  handleValueChange: PropTypes.func.isRequired,
  email: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired
}

export default Username
