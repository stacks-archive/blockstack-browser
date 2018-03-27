import React from 'react'
import PropTypes from 'prop-types'
import { Username } from './'

const Email = ({ updateView }) => (
  <section>
    <h3>
      Email
    </h3>
    <button onClick={() => updateView(Username)}>Continue</button>
  </section>
)

Email.propTypes = {
  updateView: PropTypes.func.isRequired
}

export default Email
