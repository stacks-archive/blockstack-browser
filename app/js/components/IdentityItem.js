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
        <div class="card w-50">
          <div class="card-block">
            <div className="card-avatar">
              <Image src={this.props.avatarUrl}
                fallbackSrc="https://s3.amazonaws.com/65m/avatar-placeholder.png" className="img-circle" />
            </div>
            <h3 class="card-title">{this.props.label}</h3>
            {this.props.pending ?
            <h3 class="card-title">
             (pending)
            </h3>
            : <h3></h3> }
          </div>
        </div>
      </Link>
    )
  }
}

export default IdentityItem