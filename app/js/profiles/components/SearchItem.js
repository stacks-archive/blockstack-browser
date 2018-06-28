import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Link } from 'react-router'
import { Person } from 'blockstack'

import Image from '@components/Image'
import SocialAccountItem from './SocialAccountItem'

class SearchItem extends Component {
  static propTypes = {
    profile: PropTypes.object.isRequired,
    domainName: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const person = Person.fromLegacyFormat(this.props.profile)
    const accounts = person.profile().account

    return (
      <Link
        to={`/profiles/${this.props.domainName}`}
        className="list-group-item search-result p-l-11 m-b-11"
      >
        <div className="livesearch-avatar col-md-1">
          <Image
            className="result-img img-circle"
            src={person.avatarUrl() || '/images/avatar.png'}
            id={this.props.domainName}
            fallbackSrc="https://s3.amazonaws.com/65m/avatar-placeholder.png"
          />
        </div>
        <div className="livesearch-id col-md-2">{this.props.domainName}</div>
        <div className="livesearch-name col-md-3">{person.name()}</div>
        <div className="col-md-6">
          {accounts.map((account) => {
            let socialAccount = ''
            if (account.service && account.identifier) {
              socialAccount = (
                <SocialAccountItem
                  key={`${account.service}-${account.identifier}`}
                  service={account.service}
                  identifier={account.identifier}
                  proofUrl={account.proofUrl}
                  listItem={false}
                />
              )
            }
            return socialAccount
          })}
        </div>
      </Link>
    )
  }
}

export default SearchItem
