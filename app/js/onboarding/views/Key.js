import React from 'react'
import PropTypes from 'prop-types'
import Navigation from '../components/Navigation'
import { UnlockKey, KeyConfirm } from './'

const Key = ({ updateView }) => (
  <section>
    <h3>
      Key
    </h3>
    <Navigation
      previous={() => updateView(UnlockKey)}
      next={() => updateView(KeyConfirm)}
    />
  </section>
)

Key.propTypes = {
  updateView: PropTypes.func.isRequired
}

export default Key
