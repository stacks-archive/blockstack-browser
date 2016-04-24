import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Person } from 'blockstack-profiles'

import { IdentityItem } from '../components/index'
import { IdentityActions } from '../store/identities'
import { AccountActions } from '../store/account'
import { getIdentities } from '../utils/api-utils'

function mapStateToProps(state) {
  return {
    localIdentities: state.identities.local,
    identityAddresses: state.account.identityAccount.addresses,
    addressLookupUrl: state.settings.api.addressLookupUrl || ''
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, IdentityActions, AccountActions), dispatch)
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
    const currentAddress = this.props.identityAddresses[this.props.identityAddresses.length-1],
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
        <div className="col-sm-6 col-sm-offset-3 m-t-2">
          <h4 className="text-xs-center lead-out">My Profiles</h4>
            <ul className="bookmarks-temp m-b-11">
            { localIdentities.map((identity) => {
              let person = new Person(identity.profile)
              return (
                <IdentityItem key={identity.index}
                  label={identity.registered ? identity.id : identity.id + ' (pending)'}
                  avatarUrl={person.avatarUrl() || ''}
                  url={`/profile/local/${identity.index}`} />
              )
            })}
            </ul>
          <div>
            <Link to="/names/register" className="btn btn-block btn-primary m-b-11 m-t-2">
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

/*
  <div className="row centered">
    <div className="m-b-2">
      <img src="images/blockstack-rev.svg" alt="Blockstack logo" width="100px" />
    </div>
    <div className="m-b-2">
      <img src="images/icon-browser.svg" alt="chord icon" width="82px" />
    </div>
    <h1 className="text-xs-center type-inverse">search the blockchain</h1>
    <p className="lead-out">
      Try searching for&nbsp;
      <Link to="/search/naval">naval</Link> or&nbsp;
      <Link to="/search/elizabeth">elizabeth</Link> or&nbsp;
      <Link to="/search/fred%20wilson">fred wilson</Link>
    </p>
  </div>
*/