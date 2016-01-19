import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Person, flattenObject, unflattenObject } from 'blockchain-profile'

import { getName, getSocialAccounts, getAvatarUrl } from '../utils/profile-utils.js'
import { searchIdentities } from '../utils/blockstore-utils'
import Image from './Image'

function mapStateToProps(state) {
  return {
    api: state.settings.api
  }
}

class SearchItem extends Component {
  static propTypes = {
    profile: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired
  }

  render() {
    const profile = Person.fromLegacyFormat(this.props.profile).profile,
          name = getName(profile),
          avatarUrl = getAvatarUrl(profile),
          accounts = getSocialAccounts(profile),
          _this = this

    return (
      <Link to={"/profile/" + this.props.id} className="list-group-item">
        <div className="row">
          <div className="col-md-1">
            <Image src={avatarUrl} id={this.props.id}
              fallbackSrc="https://s3.amazonaws.com/65m/avatar-placeholder.png"
              style={{ width: '25px', height: '25px' }} className="img-25" />
          </div>
          <div className="col-md-2">{name}</div>
          <div className="col-md-2">{this.props.id}</div>
          <div className="col-md-7">
            {accounts.map(function(account, index) {
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

class SearchBar extends Component {
  static propTypes = {
    placeholder: PropTypes.string.isRequired,
    api: PropTypes.object.isRequired,
    resultCount: PropTypes.number.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      query: '',
      searchResults: []
    }

    this.onQueryChange = this.onQueryChange.bind(this)
    this.onSearchResultClick = this.onSearchResultClick.bind(this)
  }

  onQueryChange(event) {
    const query = event.target.value,
          _this = this
    this.setState({
      query: query
    })
    searchIdentities(query, this.props.api.searchUrl, function(results) {
      _this.setState({
        searchResults: results.splice(0, _this.props.resultCount)
      })
    })
  }

  onSearchResultClick() {
    this.setState({
      searchResults: []
    })
  }

  render() {
    const _this = this
    return (
      <div>

        <div>
          <input className="form-control form-control-sm" type="text"
            placeholder={this.props.placeholder} name="query"
            value={this.state.query} onChange={this.onQueryChange} />
        </div>
        <ul className="list-group">
          {this.state.searchResults.map(function(result, index) {
            if (result.profile && result.username) {
              return (
                <SearchItem key={index}
                  profile={result.profile}
                  id={result.username + '.id'}
                  onClick={_this.onSearchResultClick} />
              )
            }
          })}
        </ul>

      </div>
    )
  }
}

export default connect(mapStateToProps)(SearchBar)
