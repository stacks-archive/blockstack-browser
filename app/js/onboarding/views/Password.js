import React from 'react'
import PropTypes from 'prop-types'
import Navigation from '../components/Navigation'
import { Username, Hooray } from './'

const Password = ({ updateView }) => (
  <section>
    <h3>
      Password
    </h3>
    <Navigation
      previous={() => updateView(Username)}
      next={() => updateView(Hooray)}
    />
  </section>
)

Password.propTypes = {
  updateView: PropTypes.func.isRequired
}

export default Password
