import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

class ListItem extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    body: PropTypes.string
  }

  render() {
    return (
      <Link className="list-group-item" to={this.props.url}>
        { this.props.body ?
          <div>
            <h5>{this.props.label}</h5>
            <p>{this.props.body}</p>
          </div>
        :
          <span>{this.props.label}</span>
        }
      </Link>
    )
  }
}

export default ListItem