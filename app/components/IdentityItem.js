import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

import Image from './Image'

class BookmarkListItem extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    avatarUrl: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <Link to={this.props.url} className="list-group-item">
        <div className="row booklist-wrap">
          <div className="col-md-3">
            <Image src={this.props.avatarUrl}
              fallbackSrc="https://s3.amazonaws.com/65m/avatar-placeholder.png" />
          </div>
          <div className="col-list-name">{this.props.label}</div>
        </div>
      </Link>
    )
  }
}

export default BookmarkListItem