import React, { Component, PropTypes } from 'react'

class PageHeader extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string
  }

  render() {
    return (
      <div className="page-header">
        <h1 className="type-inverse h1-modern">
          {this.props.title}
        </h1>
        { this.props.subtitle ?
        <h5 className="type-inverse p-r-1">
          {this.props.subtitle}
        </h5>
        : null }
      </div>
    )
  }
}

export default PageHeader