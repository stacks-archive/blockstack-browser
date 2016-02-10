import React, { Component, PropTypes } from 'react'

class ForwardButton extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  render() {
    return (
      <button className="btn btn-sm nav-page"
        onClick={() => this.context.router.goForward()}>
        {this.props.children}
      </button>
    )
  }
}

export default ForwardButton