import React from 'react'
import PropTypes from 'prop-types'
import Navigation from '../components/Navigation'

const Password = ({ previous, next, handleValueChange, password }) => (
  <section>
    <h3>
      Password
    </h3>
    <input
      type="text"
      name="password"
      value={password}
      onChange={handleValueChange}
    />
    <Navigation
      previous={previous}
      next={next}
    />
  </section>
)

Password.propTypes = {
  previous: PropTypes.func.isRequired,
  next: PropTypes.func.isRequired,
  handleValueChange: PropTypes.func.isRequired,
  password: PropTypes.string.isRequired
}

export default Password
