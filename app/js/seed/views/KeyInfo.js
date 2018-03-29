import React from 'react'
import PropTypes from 'prop-types'

const KeyInfo = ({ next }) => (
  <section>
    <h3>
      Key Info
    </h3>
    <button onClick={next}>Generate my key</button>
  </section>
)

KeyInfo.propTypes = {
  next: PropTypes.func.isRequired
}

export default KeyInfo
