import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { PublicKeychain } from 'keychain-manager'; delete global._bitcore
import { Person } from 'blockchain-profile'

import { IdentityItem } from '../components/index'
import { IdentityActions } from '../store/identities'
import { getIdentities } from '../utils/api-utils'
import { getName, getAvatarUrl } from '../utils/profile-utils.js'

function mapStateToProps(state) {
  return {
    localIdentities: state.identities.local,
    identityAccount: state.keychain.identityAccounts[0],
    addressLookupUrl: state.settings.api.addressLookupUrl || ''
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(IdentityActions, dispatch)
}

class DashboardPage extends Component {
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
      <div className="container">
        <div className="row centered">
          <div className="m-b-2">
            <img src="images/ch-bw-rgb-rev.svg" alt="Chord logo" width="60px" />
            <p className="lead-out">browse the blockchain</p>
          </div>
          <div className="m-b-2">
            <img src="images/icon-browser.svg" alt="chord icon" width="82px" />
          </div>
          <h1 className="text-xs-center type-inverse">search the blockchain</h1>
          <p className="lead-out">
            Try searching for <Link to="/search/naval">naval</Link> or <Link to="/search/elizabeth">elizabeth</Link> or <Link to="/search/fred%20wilson">fred wilson</Link>
          </p>
        </div>
        <div className="col-sm-6 col-sm-offset-3 m-t-2">
          <h4 className="text-xs-center lead-out">My Profiles</h4>
            <ul className="bookmarks-temp">
            { localIdentities.map(function(identity) {
              return (
                <IdentityItem key={identity.index}
                  label={identity.registered ? identity.id : identity.id + ' (pending)'}
                  avatarUrl={getAvatarUrl(identity.profile)}
                  url={`/profile/local/${identity.index}`} />
              )
            })}
            </ul>
          <div>
            <Link to="/names/register" className="btn btn-block btn-primary m-b-11">
              Register
            </Link>
            <Link to="/names/import" className="btn btn-block btn-secondary">
              Import
            </Link>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardPage)