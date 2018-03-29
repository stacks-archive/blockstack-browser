import React from 'react'

const ProgressBar = ({ percent }) => (
  <div>
    <div style={{ width: `${percent}%` }} />
  </div>
)

export default ProgressBar
