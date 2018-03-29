import React from 'react'
import PropTypes from 'prop-types'
import Navigation from '../../components/Navigation'

const UnlockKey = ({ next, previous }) => (
  <section>
    <h3>
      Unlock Key
    </h3>
    <Navigation
      previous={previous}
      next={next}
    />
  </section>
)

UnlockKey.propTypes = {
  next: PropTypes.func.isRequired,
  previous: PropTypes.func.isRequired
}

export default UnlockKey
