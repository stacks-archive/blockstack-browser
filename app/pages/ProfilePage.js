import React, { Component } from 'react'
import { Link } from 'react-router'
import { Person, flattenObject } from 'blockchain-profile'
import AccountListItem from '../components/AccountListItem'
import { Naval, Ryan } from '../data/SampleProfiles'
import { getName, getVerifiedAccounts, getAvatarUrl } from '../utils/profile-utils.js'

const propTypes = {
}

function getProfile(id, callback) {
  var username = id.replace('.id', '')
  var url = 'http://resolver.onename.com/v2/users/' + username
  var _this = this
  fetch(url)
    .then((response) => response.text())
    .then((responseText) => JSON.parse(responseText))
    .then((responseJson) => {
      var legacyProfile = responseJson[username]['profile'],
          verifications = responseJson[username]['verifications'],
          profile = Person.fromLegacyFormat(legacyProfile).profile
      callback(profile, verifications)
    })
    .catch((error) => {
      console.warn(error)
    })
}

class ProfilePage extends Component {

  constructor(props) {
    super(props)

    this.state = {
      id: this.props.routeParams.id,
      profile: {},
      verifications: []
    }
  }

  componentDidReceiveProps(id) {
    var _this = this
    getProfile(id, (profile, verifications) => {
      _this.setState({
        id: id,
        profile: profile,
        verifications: verifications
      })
    })
  }

  componentDidMount() {
    this.componentDidReceiveProps(this.state.id)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.routeParams.id !== this.state.id) {
      this.componentDidReceiveProps(nextProps.routeParams.id)
    }
  }

  render() {
    var blockchainId = this.state.id,
        profile = this.state.profile,
        verifications = this.state.verifications

    return (
      <div className="row">
        <div className="col-md-6">
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
                  <h4>{blockchainId}</h4>
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
        </div>
        <div className="col-md-6">
          <div>
            <Link to={this.props.location.pathname + "/edit"}>
              Edit
            </Link>
          </div>
          <div>
            <Link to={this.props.location.pathname + "/export"}>
              Export
            </Link>
          </div>
        </div>
      </div>
    )
  }
}

ProfilePage.propTypes = propTypes

export default ProfilePage
