import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { PublicKeychain } from 'keychain-manager'; delete global._bitcore

import ListItem from '../components/ListItem'
import { IdentityActions } from '../store/identities'
import { getNamesOwned, getIdentities } from '../utils/blockstore-utils'

function mapStateToProps(state) {
  return {
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
          _this = this

    getIdentities(currentAddress, this.props.addressLookupUrl, this.state.localIdentities, function(localIdentities, newNames) {
      _this.setState({
        localIdentities: localIdentities
      })
      newNames.forEach(function(name) {
        _this.props.createNewIdentity(name)
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
        <h3>Identities</h3>

        <div style={{paddingBottom: '15px'}}>
          <ul className="list-group">
          { localIdentities.map(function(identity) {
            return (
              <ListItem
                key={identity.index}
                label={ identity.registered ? identity.id : identity.id + ' (pending)' }
                url={"/profile/local/" + identity.index} />
            )
          })}
          </ul>
        </div>
        <p>
          <Link to="/register" className="btn btn-primary">
            Register
          </Link>
        </p>
        <p>
          <Link to="/import" className="btn btn-secondary">
            Import
          </Link>
        </p>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(IdentitiesPage)