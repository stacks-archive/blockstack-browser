import React from 'react'
import PropTypes from 'prop-types'
import { UnlockKey } from './'

const KeyInfo = ({ updateView }) => (
  <section>
    <h3>
      Key Info
    </h3>
    <button onClick={() => updateView(UnlockKey)}>Continue</button>
    <button onClick={() => {}}>Do it later</button>
  </section>
)

KeyInfo.propTypes = {
  updateView: PropTypes.func.isRequired
}

export default KeyInfo
