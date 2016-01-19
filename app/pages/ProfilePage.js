import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import AccountListItem from '../components/AccountListItem'
import { getName, getVerifiedAccounts, getAvatarUrl } from '../utils/profile-utils.js'
import { IdentityActions } from '../store/identities'

function mapStateToProps(state) {
  return {
    currentIdentity: state.identities.current,
    localIdentities: state.identities.local,
    nameLookupUrl: state.settings.api.nameLookupUrl
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(IdentityActions, dispatch)
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
          <div className="col-md-4">
            <div>
              <div className="profile-wrap">
                <div className="idcard-block">
                  <div className="id-flex">
                    <img className="img-idcard" src={getAvatarUrl(profile)} />
                    <div className="overlay"></div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <Link to={this.props.location.pathname + "/edit"} className="btn btn-primary btn-lg btn-pro-edit">
                Edit
              </Link>
            </div>
          </div>
          <div className="col-md-5">
            <div className="idcard-wrap">
              <div className="idcard-body inverse">
                {blockchainId} guylepage3
              </div>
              <div className="idcard-body dim">
                Registered in block <span className="inverse">#387562</span>,<br/>
                transaction <span className="inverse">#339</span>
              </div>
              <h1 className="idcard-name">{getName(profile)}</h1>
              <div className="idcard-body inverse">
                {profile.description}
              </div>
              <div className="idcard-body dim">
                154 Grand St,<br/>
                New York, NY 10013, United States
              </div>
              <div className="idcard-body dim">
                Born Oct 14, 1986
              </div>
              <div className="pill-nav pull-right">
                <Link to={this.props.location.pathname + "/export"}>
                  <img src="images/icon-export.svg"/>
                </Link>
              </div>
            </div>
            
          </div>
          <div className="container col-md-3 pull-right">
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
