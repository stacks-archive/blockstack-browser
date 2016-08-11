import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Person } from 'blockstack-profiles'

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

class Sidebar extends Component {
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
      <div className="sidebar-wrapper">
        <div className="sidebar-section">
          <div className="sidebar-label">Personas</div>
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
          <div>
            <Link to="/names/register" className="btn btn-block btn-primary m-b-11 m-t-2">
              Register
            </Link>
            <Link to="/names/import" className="btn btn-block btn-secondary">
              Import
            </Link>
          </div>
        </div>
        <div className="sidebar-gutter"></div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar)