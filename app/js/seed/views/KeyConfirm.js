import React from 'react'
import PropTypes from 'prop-types'
import Navigation from '@components/Navigation'

const KeyConfirm = ({ next, previous }) => (
  <section>
    <h3>
      Key Confirm
    </h3>
    <Navigation
      previous={previous}
      next={next}
    />
  </section>
)

KeyConfirm.propTypes = {
  next: PropTypes.func.isRequired,
  previous: PropTypes.func.isRequired
}

export default KeyConfirm
