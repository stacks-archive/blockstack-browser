import React, { Component } from 'react'
import { Link } from 'react-router'

class Completion extends Component {
  static propTypes = {
  }

  render() {
    return (
      <div class="tooltip tooltip-bottom" role="tooltip">
        <div class="tooltip-inner">
          Tooltip on the bottom
        </div>
      </div>
    )
  }
}

export default Completion