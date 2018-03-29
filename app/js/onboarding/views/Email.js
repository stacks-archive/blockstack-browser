import React from 'react'
import PropTypes from 'prop-types'

const Email = ({ next, handleValueChange, email }) => (
  <section>
    <h3>
      What is your email?
    </h3>
    <input
      type="text"
      name="email"
      value={email}
      onChange={handleValueChange}
    />
    <button onClick={next}>Continue</button>
  </section>
)

Email.propTypes = {
  next: PropTypes.func.isRequired,
  handleValueChange: PropTypes.func.isRequired,
  email: PropTypes.string.isRequired
}

export default Email
