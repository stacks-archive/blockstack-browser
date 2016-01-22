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
        id: null,
        profile: null,
        verifications: []
      }
    }
  }

  componentHasNewRouteParams(routeParams) {
    if (routeParams.index) {
      const profile = this.props.localIdentities[routeParams.index].profile,
            name = this.props.localIdentities[routeParams.index].id,
            verifications = []
      this.props.updateCurrentIdentity(name, profile, verifications)
    } else if (routeParams.name) {
      this.props.fetchCurrentIdentity(routeParams.name, this.props.nameLookupUrl)
    }
  }

  componentWillMount() {
    this.componentHasNewRouteParams(this.props.routeParams)
  }

  componentWillUnmount() {
    this.props.updateCurrentIdentity('', {}, [])
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.routeParams !== this.props.routeParams) {
      this.componentHasNewRouteParams(nextProps.routeParams)
    }
    this.setState({
      currentIdentity: nextProps.currentIdentity
    })
  }

  render() {
    const blockchainId = this.state.currentIdentity.id,
          profile = this.state.currentIdentity.profile,
          verifications = this.state.currentIdentity.verifications
    const blockNumber = 387562,
          transactionNumber = 339,
          address = 'Address hidden',
          birthDate = 'Birth date hidden'

    return ( 
      <div className="profile-spacer">
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
              <Link to={this.props.location.pathname + "/edit"}
                className="btn btn-primary btn-lg btn-pro-edit">
                Edit
              </Link>
            </div>
          </div>
          <div className="col-md-5">
            <div className="idcard-wrap">
              <div className="idcard-body inverse">
                {blockchainId}
              </div>
              <div className="idcard-body dim">
                Registered in block <span className="inverse">#{blockNumber}</span>,<br/>
                transaction <span className="inverse">#{transactionNumber}</span>
              </div>
              <p className="col-md-9 profile-foot">
                Connections
              </p>
              <div className="idcard-body dim">
                {address}
              </div>
              <div className="idcard-body dim">
                {birthDate}
              </div>
            </div>
          </div>
          <div className="container col-md-3 pull-right profile-right-col-fill">
            <div className="profile-right-col inverse">
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
        :
        <div></div>
        }
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage)
