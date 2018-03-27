import React from 'react'
import PropTypes from 'prop-types'
import Navigation from '../components/Navigation'

const RecoveryOptions = ({ previous, next }) => (
  <section>
    <h3>
      Recovery Options
    </h3>
    <Navigation previous={previous} next={next} />
  </section>
)

RecoveryOptions.propTypes = {
  previous: PropTypes.func.isRequired,
  next: PropTypes.func.isRequired
}

export default RecoveryOptions
