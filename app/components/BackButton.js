import React, { Component, PropTypes } from 'react'

class BackButton extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  render() {
    return (
      <button className="btn btn-sm nav-page"
        onClick={() => this.context.router.goBack()}>
        {this.props.children}
      </button>
    )
  }
}

export default BackButton