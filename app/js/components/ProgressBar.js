import React from 'react'
import Panel from '@styled/onboarding'
import PropTypes from 'prop-types'

const ProgressBar = ({ total, current, variant = 'default' }) => (
  <Panel.Progress variant={variant}>
    {Array.from(Array(total)).map((dot, i) => (
      <Panel.Progress.Dot
        key={i}
        active={current === i}
        complete={current > i}
      />
    ))}
  </Panel.Progress>
)

ProgressBar.propTypes = {
  total: PropTypes.number,
  current: PropTypes.number,
  variant: PropTypes.string
}

export default ProgressBar
