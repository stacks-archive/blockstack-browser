import React from 'react'
import PropTypes from 'prop-types'
import Navigation from '@components/Navigation'

const Key = ({ next, previous }) => (
  <section>
    <h3>
      Key
    </h3>
    <Navigation
      previous={previous}
      next={next}
    />
  </section>
)

Key.propTypes = {
  next: PropTypes.func.isRequired,
  previous: PropTypes.func.isRequired
}

export default Key
