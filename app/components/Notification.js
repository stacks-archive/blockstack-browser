import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

export default class Notification extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
  }

  render() {
    return (
      <Link className="list-group-item" to={this.props.url}>
        <span>{this.props.label}</span>
      </Link>
    )
  }
}