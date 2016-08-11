import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

import Image from './Image'

class IdentityItem extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    avatarUrl: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    pending: PropTypes.bool.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <Link to={this.props.url} className="list-group-item list-group-item-dash">
        <div className="booklist-wrap">
          <div className="list-group-avatar">
            <Image src={this.props.avatarUrl}
              fallbackSrc="https://s3.amazonaws.com/65m/avatar-placeholder.png" />
          </div>
          <div className="col-list-name">
            {this.props.label}
            {this.props.pending ?
            <span className="list-current-state">
             (pending)
            </span>
          : <span></span> }
          </div>
        </div>
      </Link>
    )
  }
}

export default IdentityItem