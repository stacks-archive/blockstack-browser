import React from 'react'
import PropTypes from 'prop-types'
import Navigation from '../components/Navigation'
import { Key, KeyComplete } from './'

const KeyConfirm = ({ updateView }) => (
  <section>
    <h3>
      Key Confirm
    </h3>
    <Navigation
      previous={() => updateView(Key)}
      next={() => updateView(KeyComplete)}
    />
  </section>
)

KeyConfirm.propTypes = {
  updateView: PropTypes.func.isRequired
}

export default KeyConfirm
