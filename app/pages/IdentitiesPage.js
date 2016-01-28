import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { PublicKeychain } from 'keychain-manager'; delete global._bitcore
import { Person } from 'blockchain-profile'

import IdentityItem from '../components/IdentityItem'
import { IdentityActions } from '../store/identities'
import { getIdentities } from '../utils/api-utils'
import { getName, getAvatarUrl } from '../utils/profile-utils.js'

function mapStateToProps(state) {
  return {
    bookmarks: state.settings.bookmarks,
    localIdentities: state.identities.local,
    identityAccount: state.keychain.identityAccounts[0],
    addressLookupUrl: state.settings.api.addressLookupUrl
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(IdentityActions, dispatch)
}

class IdentitiesPage extends Component {
  static propTypes = {
    localIdentities: PropTypes.array.isRequired,
    createNewIdentity: PropTypes.func.isRequired,
    addressLookupUrl: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      localIdentities: this.props.localIdentities
    }
    this.componentHasNewProps = this.componentHasNewProps.bind(this)
  }

  componentHasNewProps() {
    const accountKeychain = new PublicKeychain(this.props.identityAccount.accountKeychain),
          addressIndex = this.props.identityAccount.addressIndex,
          currentAddress = accountKeychain.child(addressIndex).address().toString(),
          addressLookupUrl = this.props.addressLookupUrl,
          localIdentities = this.state.localIdentities

    getIdentities(currentAddress, addressLookupUrl, localIdentities, (localIdentities, newNames) => {
      this.setState({
        localIdentities: localIdentities
      })
      newNames.forEach((name) => {
        this.props.createNewIdentity(name)
      })
    })
  }

  componentDidMount() {
    this.componentHasNewProps()
  }

  componentWillReceiveProps(nextProps) {
    this.componentHasNewProps()
  }

  render() {
    const localIdentities = this.state.localIdentities || []

    return (
      <div>
        <div className="row">
          <div className="col-md-6">
            <h4 className="headspace inverse">My Identities</h4>
            <div style={{paddingBottom: '15px'}}>
              <ul className="list-group bookmarks-temp">
              { localIdentities.map(function(identity) {
                return (
                  <IdentityItem key={identity.index}
                    label={identity.registered ? identity.id : identity.id + ' (pending)'}
                    avatarUrl={getAvatarUrl(identity.profile)}
                    url={`/profile/local/${identity.index}`} />
                )
              })}
              </ul>
            </div>
            <p>
              <Link to="/identities/register" className="btn btn-primary">
                Register
              </Link>
            </p>
            <p>
              <Link to="/identities/import" className="btn btn-secondary">
                Import
              </Link>
            </p>
          </div>
          <div className="col-md-6">
            <h4 className="headspace inverse">Featured Identities</h4>
            <div style={{paddingBottom: '15px'}}>
              <ul className="list-group bookmarks-temp">
              { this.props.bookmarks.map(function(bookmark, index) {
                let profile = bookmark.profile
                if (!bookmark.profile.hasOwnProperty('@type')) {
                  profile = Person.fromLegacyFormat(bookmark.profile).profile
                }
                return (
                  <IdentityItem key={index}
                    label={getName(profile)} 
                    avatarUrl={getAvatarUrl(profile)}
                    url={`/profile/blockchain/${bookmark.id}`} />
                )
              })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(IdentitiesPage)