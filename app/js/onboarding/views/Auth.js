import React from 'react'
import PropTypes from 'prop-types'
import Navigation from '../components/Navigation'

const Auth = ({ previous, next }) => (
  <section>
    <h3>
      Auth
    </h3>
    <Navigation previous={previous} next={next} />
  </section>
)

Auth.propTypes = {
  previous: PropTypes.func.isRequired,
  next: PropTypes.func.isRequired
}

export default Auth
