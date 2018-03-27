import React from 'react'
import PropTypes from 'prop-types'
import Navigation from '../components/Navigation'
import { Password, Email } from './'

const Username = ({ updateView }) => (
  <section>
    <h3>
      Username
    </h3>
    <Navigation
      previous={() => updateView(Email)}
      next={() => updateView(Password)}
    />
  </section>
)

Username.propTypes = {
  updateView: PropTypes.func.isRequired
}

export default Username
