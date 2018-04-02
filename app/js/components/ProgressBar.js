import React from 'react'

import Panel from '@styled/onboarding'

const ProgressBar = ({ total, current, variant }) => {
  const percent = current / total * 100

  switch (variant) {
    case 'dots':
      return (
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
    default:
      return (
        <Panel.Progress>
          <div style={{ width: `${percent}%` }}>
            <h5>{`${percent}% complete`}</h5>
          </div>
        </Panel.Progress>
      )
  }
}

export default ProgressBar
