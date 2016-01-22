import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { Person } from 'blockchain-profile'

import Image from './Image'
import { getName, getSocialAccounts, getAvatarUrl } from '../utils/profile-utils.js'

class SearchItem extends Component {
  static propTypes = {
    profile: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const profile = Person.fromLegacyFormat(this.props.profile).profile,
          name = getName(profile),
          avatarUrl = getAvatarUrl(profile),
          accounts = getSocialAccounts(profile),
          blockchainId = this.props.id

    return (
      <Link to={"/profile/" + blockchainId} className="list-group-item">
        <div className="row">
          <div className="col-md-1">
            <Image src={avatarUrl} id={blockchainId}
              fallbackSrc="https://s3.amazonaws.com/65m/avatar-placeholder.png"
              style={{ width: '40px', height: '40px' }} />
          </div>
          <div className="col-md-2">{name}</div>
          <div className="col-md-2">{blockchainId}</div>
          <div className="col-md-7">
            {accounts.map((account, index) => {
              return (
                <span key={index}>
                  <span>{account.service} : {account.identifier}</span>
                  { index !== accounts.length - 1 ?
                  <span>&nbsp;/&nbsp;</span>
                  : null }
                </span>
              )
            })}
          </div>
        </div>
      </Link>
    )
  }
}

export default SearchItem