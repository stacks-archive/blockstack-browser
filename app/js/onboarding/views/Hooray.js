import React from 'react'
import PropTypes from 'prop-types'

const Hooray = ({ goToApp, goToRecovery }) => (
  <section>
    <h3>
      Hooray
    </h3>
    <button onClick={goToApp}>Continue to Stealthy</button>
    <button onClick={goToRecovery}>Write down secret key</button>
  </section>
)

Hooray.propTypes = {
  goToApp: PropTypes.func.isRequired,
  goToRecovery: PropTypes.func.isRequired
}

export default Hooray
