import React from 'react'
import PropTypes from 'prop-types'
import { KeyInfo } from './'

const Hooray = ({ updateView }) => (
  <section>
    <h3>
      Hooray
    </h3>
    <button onClick={() => {}}>Continue to Stealthy</button>
    <button onClick={() => updateView(KeyInfo)}>Write down secret key</button>
  </section>
)

Hooray.propTypes = {
  updateView: PropTypes.func.isRequired
}

export default Hooray
