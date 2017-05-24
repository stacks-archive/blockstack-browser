import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Person } from 'blockstack'

import IdentityItem from './components/IdentityItem'
import { IdentityActions } from './store/identity'
import { AccountActions }  from '../account/store/account'

import log4js from 'log4js'

const logger = log4js.getLogger('profiles/AllProfilesPage.js')

function mapStateToProps(state) {
  return {
    localIdentities: state.profiles.identity.localIdentities,
    namesOwned: state.profiles.identity.namesOwned,
    identityAddresses: state.account.identityAccount.addresses,
    nextUnusedAddressIndex: state.account.identityAccount.addressIndex,
    api: state.settings.api
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, IdentityActions, AccountActions), dispatch)
}

class IdentityPage extends Component {
  static propTypes = {
    localIdentities: PropTypes.object.isRequired,
    createNewIdentityFromDomain: PropTypes.func.isRequired,
    refreshIdentities: PropTypes.func.isRequired,
    namesOwned: PropTypes.array.isRequired,
    api: PropTypes.object.isRequired,
    identityAddresses: PropTypes.array.isRequired,
    nextUnusedAddressIndex: PropTypes.number.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      localIdentities: this.props.localIdentities
    }

    this.createNewProfile = this.createNewProfile.bind(this)
    this.availableIdentityAddresses = this.availableIdentityAddresses.bind(this)
  }

  componentWillMount() {
    this.props.refreshIdentities(
      this.props.api,
      this.props.identityAddresses,
      this.props.localIdentities,
      this.props.namesOwned
    )
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      localIdentities: nextProps.localIdentities
    })
  }

  createNewProfile(event) {
    event.preventDefault()
    const ownerAddress = this.props.identityAddresses[this.props.nextUnusedAddressIndex]
    logger.debug(`createNewProfile: ownerAddress: ${ownerAddress}`)
    this.props.createNewIdentityFromDomain(ownerAddress, ownerAddress)
  }

  availableIdentityAddresses() {
    return this.props.nextUnusedAddressIndex + 1 <= this.props.identityAddresses.length
  }

  render() {
    return (
      <div className="card-list-container profile-content-wrapper">
        <div>
          <h5 className="h5-landing">My Profiles</h5>
        </div>
        <div className="container card-list-container">
          <ul className="card-wrapper">
            {Object.keys(this.state.localIdentities).map((domainName) => {
              const identity = this.state.localIdentities[domainName],
                    person = new Person(identity.profile)

                    if (identity.ownerAddress === domainName) {
                      identity.canAddUsername = true
                    } else {
                      identity.canAddUsername = false
                    }
              if (identity.domainName) {
                return (
                  <IdentityItem key={identity.domainName}
                    label={identity.domainName}
                    pending={!identity.registered}
                    avatarUrl={person.avatarUrl() || ''}
                    url={`/profiles/${identity.domainName}/local`}
                    ownerAddress={identity.ownerAddress}
                    canAddUsername={identity.canAddUsername}
                  />
                )
              }
            })}
          </ul>
        </div>
        <div className="card-list-container m-t-30">
          <button
            className="btn btn-blue btn-lg" onClick={this.createNewProfile}
            disabled={!this.availableIdentityAddresses()}
          >
            + Create
          </button>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(IdentityPage)
