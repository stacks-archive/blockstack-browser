import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import AccountListItem from '../components/AccountListItem'
import { getName, getVerifiedAccounts, getAvatarUrl } from '../utils/profile-utils.js'
import * as ProfileActions from '../actions/identities'

function mapStateToProps(state) {
  return {
    currentIdentity: state.identities.current,
    localIdentities: state.identities.local,
    nameLookupUrl: state.settings.api.nameLookupUrl
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ProfileActions, dispatch)
}

class ProfilePage extends Component {
  static propTypes = {
    fetchCurrentIdentity: PropTypes.func.isRequired,
    updateCurrentIdentity: PropTypes.func.isRequired,
    currentIdentity: PropTypes.object.isRequired,
    localIdentities: PropTypes.array.isRequired,
    nameLookupUrl: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      currentIdentity: {
        profile: null,
        verifications: []
      }
    }
  }

  componentHasNewRouteParams(routeParams) {
    if (routeParams.index) {
      const profile = this.props.localIdentities[routeParams.index].profile,
            verifications = []
      this.props.updateCurrentIdentity(profile, verifications)
    } else if (routeParams.name) {
      this.props.fetchCurrentIdentity(routeParams.name, this.props.nameLookupUrl)
    }
  }

  componentWillMount() {
    this.componentHasNewRouteParams(this.props.routeParams)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.routeParams.id !== this.props.routeParams.id) {
      this.componentHasNewRouteParams(nextProps.routeParams)
    }
    this.setState({
      currentIdentity: nextProps.currentIdentity
    })
  }

  render() {
    var blockchainId = this.props.id,
        profile = this.state.currentIdentity.profile,
        verifications = this.state.currentIdentity.verifications
    return ( 
      <div>
        { profile !== null && profile !== undefined ?
        <div>
          <div className="col-md-6">
            <div className="profile-dropdown-tab">
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
                </div>
              </div>
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
          <div className="container pull-right">
            <div>
              <ul>
                {getVerifiedAccounts(profile, verifications).map(function(account) {
                  return (
                    <AccountListItem
                      key={account.service + '-' + account.identifier}
                      service={account.service}
                      identifier={account.identifier}
                      proofUrl={account.proofUrl} />
                  )
                })}
              </ul>
            </div>
          </div>
        </div>
          : <div></div> }
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage)
