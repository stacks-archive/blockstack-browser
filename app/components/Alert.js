import React, { Component, PropTypes } from 'react'

class Alert extends Component {
  static propTypes = {
    message: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired
  }

  constructor() {
    super()

    this.state = {
      shown: true
    }

    this.hide = this.hide.bind(this)
  }

  hide() {
    this.setState({
      shown: false
    })
  }

  render() {
    return (
      <div>
        { this.state.shown ?
        <div className={"alert alert-dismissible fade in" + " alert-" + this.props.status} role="alert">
          <button className="close" data-dismiss="alert" aria-label="Close" onClick={this.hide}>
            <span aria-hidden="true">&times;</span>
          </button>
          {this.props.message}
        </div>
        : null }
      </div>
    )
  }
}

export default Alert