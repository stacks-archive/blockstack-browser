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
      <Link to={this.props.url} className="card m-b-35">
        <div class="card-block">
          <div className="card-avatar">
            <Image src={this.props.avatarUrl}
              fallbackSrc="/images/avatar.png" className="img-circle" />
          </div>
          <h3 class="card-title">{this.props.label}</h3>
          {this.props.pending ?
          <h3 class="card-title">
           (pending)
          </h3>
          : <h3></h3> }
        </div>
      </Link>
    )
  }
}

export default IdentityItem