import React, { Component } from 'react'
import { Link } from 'react-router'
import { Person, flattenObject } from 'blockchain-profile'
import AccountListItem from './AccountListItem'
import { Naval, Ryan } from './SampleProfiles'

function getName(profile) {
    var name = ''
    if (profile.givenName || profile.familyName) {
      if (profile.givenName) {
        name = profile.givenName
      }
      if (profile.familyName) {
        name += ' ' + profile.familyName
      }
    } else if (profile.name) {
      name = profile.name
    }
    return name
}

function getVerifiedAccounts(profile, verifications) {
  var filteredAccounts = []
  if (profile.account) {
    profile.account.forEach(function(account) {
      var proofUrl = ''
      verifications.forEach(function(verification) {
        if (verification.valid && verification.service === account.service
            && verification.identifier === account.identifier) {
          proofUrl = verification.proof_url
        }
      })
      account.proofUrl = proofUrl
      if (account.identifier && account.service) {
        filteredAccounts.push(account)
      }
    })
  }
  return filteredAccounts
}

function getAvatarUrl(profile) {
    var avatarContentUrl
    if (profile.image) {
      if (profile.image.length > 0) {
        avatarContentUrl = profile.image[0].contentUrl
      }
    }
    return avatarContentUrl
}

class Profile extends Component {

  constructor() {
    super()

    this.state = {
      profile: Naval,
      username: 'naval'
    }
  }

  componentDidMount() {
    /*var _this = this
    var username = 'naval'
    var url = 'https://api.onename.com/v1/users/' + username

    fetch(url)
      .then((response) => response.text())
      .then((responseText) => JSON.parse(responseText))
      .then((responseJson) => {

        var legacyProfile = responseJson[username]['profile']
        var profile = Person.fromLegacyFormat(legacyProfile).profile
        _this.setState({
          profile: profile
        })
      })
      .catch((error) => {
        console.warn(error)
      })
    */
  }

  render() {
    var username = this.state.username
    var profile = this.state.profile
    var accounts = []
    var verifications = []
    var flatProfile = flattenObject(profile)

    return (
      <div className="profile-dropdown-tab">
        { profile ?
        <div className="profile-wrap">
          <div className="idcard-block">
            <div className="id-flex">
              <img className="img-idcard" src={getAvatarUrl(profile)} />
              <div className="overlay"></div>
            </div>
          </div>
          <div className="idcard-wrap">
            <div className="idcard-blockchainid">
              <h4>{username}</h4>
            </div>
            <h1 className="idcard-name">{getName(profile)}</h1>
            <div className="id-social">
              <div>
                <ul>
                  {getVerifiedAccounts(profile, verifications).map(function(account) {
                    return (
                      <AccountListItem
                        key={account.service + '-' + account.identifier}
                        service={account.service}
                        identifier={account.identifier}
                        proofUrl={account.proofUrl} />)
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
        : null }
      </div>
    )
  }
}

export default Profile