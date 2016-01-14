import React, { Component, PropTypes } from 'react'

class Alert extends Component {
  static propTypes = {
    message: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired
  }

  render() {
    return (
      <div className={"alert alert-" + this.props.status}>
        {this.props.message}
      </div>
    )
  }
}

export default Alert