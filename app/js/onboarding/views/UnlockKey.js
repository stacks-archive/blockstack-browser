import React from 'react'
import PropTypes from 'prop-types'
import Navigation from '../components/Navigation'
import { KeyInfo, Key } from './'

const UnlockKey = ({ updateView }) => (
  <section>
    <h3>
      Unlock Key
    </h3>
    <Navigation
      previous={() => updateView(KeyInfo)}
      next={() => updateView(Key)}
    />
  </section>
)

UnlockKey.propTypes = {
  updateView: PropTypes.func.isRequired
}

export default UnlockKey
