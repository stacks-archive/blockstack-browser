import React from 'react'
import Panel from '@styled/onboarding'

const ProgressBar = ({ total, current, variant }) => (
  <Panel.Progress>
    {Array.from(Array(total)).map((dot, i) => (
      <Panel.Progress.Dot
        key={i}
        active={current === i}
        complete={current > i}
      />
    ))}
  </Panel.Progress>
)

export default ProgressBar
