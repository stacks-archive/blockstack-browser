import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { Person } from 'blockstack-profiles'

import Image from './Image'

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
    let person = Person.fromLegacyFormat(this.props.profile),
        blockchainId = this.props.id,
        accounts = person.profile().accounts

    return (
      <Link to={`/profile/blockchain/${blockchainId}`}
        className="list-group-item search-result p-l-11 m-b-11">
          <div className="col-md-1">
            <Image className="result-img" src={person.avatarUrl()} id={blockchainId}
              fallbackSrc="https://s3.amazonaws.com/65m/avatar-placeholder.png" />
          </div>
          <div className="col-md-3">{person.name()}</div>
          <div className="col-md-2">{blockchainId}</div>
          <div className="col-md-6">
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
      </Link>
    )
  }
}

export default SearchItem