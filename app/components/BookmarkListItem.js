import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { Person } from 'blockchain-profile'

import Image from './Image'
import { getName, getAvatarUrl } from '../utils/profile-utils.js'

class BookmarkListItem extends Component {
  static propTypes = {
    profile: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    let profile = this.props.profile
    console.log(profile)
    if (!this.props.profile.hasOwnProperty('@type')) {
      profile = Person.fromLegacyFormat(this.props.profile).profile
    }
    console.log(profile)

    const name = getName(profile),
          avatarUrl = getAvatarUrl(profile),
          blockchainId = this.props.id

    return (
      <Link to={`/profile/${blockchainId}`} className="list-group-item">
        <div className="row">
          <div className="col-md-4">
            <Image src={avatarUrl} id={blockchainId}
              fallbackSrc="https://s3.amazonaws.com/65m/avatar-placeholder.png"
              style={{ width: '40px', height: '40px' }} />
          </div>
          <div className="col-md-4">{name}</div>
          <div className="col-md-4">{blockchainId}</div>
        </div>
      </Link>
    )
  }
}

export default BookmarkListItem