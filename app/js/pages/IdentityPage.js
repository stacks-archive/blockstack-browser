import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Person } from 'blockstack-profiles'

import AddressBar from '../components/AddressBar'
import { IdentityItem } from '../components/index'
import { IdentityActions } from '../store/identities'
import { AccountActions } from '../store/account'

function mapStateToProps(state) {
  return {
    localIdentities: state.identities.localIdentities,
    lastNameLookup: state.identities.lastNameLookup,
    identityAddresses: state.account.identityAccount.addresses,
    addressLookupUrl: state.settings.api.addressLookupUrl || ''
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, IdentityActions, AccountActions), dispatch)
}

class IdentityPage extends Component {
  static propTypes = {
    localIdentities: PropTypes.object.isRequired,
    createNewIdentity: PropTypes.func.isRequired,
    refreshIdentities: PropTypes.func.isRequired,
    addressLookupUrl: PropTypes.string.isRequired,
    lastNameLookup: PropTypes.array.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      localIdentities: this.props.localIdentities
    }
  }

  componentWillMount() {
    this.props.refreshIdentities(
      this.props.identityAddresses,
      this.props.addressLookupUrl,
      this.props.localIdentities,
      this.props.lastNameLookup
    )
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      localIdentities: nextProps.localIdentities
    })
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-toggleable-md navbar-light bg-faded">          
          <a className="navbar-brand" href="#">Profiles</a>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item active">
                <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Features</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Pricing</a>
              </li>
              <li className="nav-item">
                <a className="nav-link disabled" href="#">Disabled</a>
              </li>
            </ul>
          </div>
        </nav>
        <nav className="navbar">
          <div>
            <div className=""></div>
          </div>
          <div className="navbar-light bg-faded">
            <div className="nav navbar-nav">
              <div className="nav-search">
                <div className="nav-link">
                  <AddressBar placeholder="Search for people, apps & more…" />
                </div>
              </div>
            </div>
          </div>
        </nav>

        <div className="m-b-2">
          <h3>Profiles</h3>
        </div>
        <div className="m-b-2">
          <Link to="/names/register" className="btn btn-side-emphasis btn-side-pull-left" >
            Register
          </Link>
          <Link to="/names/import" className="btn btn-side-secondary">
            Import
          </Link>
        </div>
        <div className="m-b-2">
          <ul className="nav sidebar-list">
          {Object.keys(this.state.localIdentities).map((domainName) => {
            const identity = this.state.localIdentities[domainName],
                  person = new Person(identity.profile)
            if (identity.domainName) {
              return (
                <IdentityItem key={identity.domainName}
                  label={identity.domainName}
                  pending={!identity.registered}
                  avatarUrl={person.avatarUrl() || ''}
                  url={`/profile/local/${identity.domainName}`} />
              )
            }
          })}
          </ul>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(IdentityPage)