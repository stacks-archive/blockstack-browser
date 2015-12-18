import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

export default class Notification extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    body: PropTypes.string
  }

  render() {
    return (
      <Link className="list-group-item" to={this.props.url}>
        <h5>{this.props.label}</h5>
        { this.props.body ?
        <p>{this.props.body}</p>
        : null }
      </Link>
    )
  }
}