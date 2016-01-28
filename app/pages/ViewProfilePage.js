import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import SocialAccountItem from '../components/SocialAccountItem'
import {
  getName, getVerifiedAccounts, getAvatarUrl,
  getAddress, getBirthDate, getConnections
} from '../utils/profile-utils.js'
import { IdentityActions } from '../store/identities'
import { SearchActions } from '../store/search'
import Image from '../components/Image'

function mapStateToProps(state) {
  return {
    currentIdentity: state.identities.current,
    localIdentities: state.identities.local,
    nameLookupUrl: state.settings.api.nameLookupUrl,
    bookmarks: state.settings.bookmarks
  }
}

function mapDispatchToProps(dispatch) {
  let actions = Object.assign(IdentityActions, SearchActions)
  return bindActionCreators(actions, dispatch)
}

class ViewProfilePage extends Component {
  static propTypes = {
    fetchCurrentIdentity: PropTypes.func.isRequired,
    updateCurrentIdentity: PropTypes.func.isRequired,
    updateQuery: PropTypes.func.isRequired,
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
        verifications: [],
        blockNumber: null,
        transactionNumber: null
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
    let identity = this.state.currentIdentity,
      blockchainId = identity.id

    if (blockchainId === 'naval.id') {
      identity = this.props.bookmarks[0]
    }

    let profile = identity.profile,
        verifications = identity.verifications,
        blockNumber = identity.blockNumber,
        transactionIndex = identity.transactionIndex,
        connections = getConnections(profile), 
        address = getAddress(profile),
        birthDate = getBirthDate(profile)

    return (
      <div className="profile-spacer">
        { profile !== null && profile !== undefined ?
        <div>
          <div className="col-md-9">
            <div className="container">
              <div className="col-md-5">
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
              <div className="col-md-7">
                <div className="idcard-wrap">
                  { (blockNumber && transactionIndex) ?
                  <div className="idcard-body dim">
                    Registered in block <span className="inverse">#{blockNumber}</span>,<br/>
                    transaction <span className="inverse">#{transactionIndex}</span>
                  </div>
                  : null }
                  <h1 className="idcard-name">{getName(profile)}</h1>
                  <div className="idcard-body inverse">
                    {profile.description}
                  </div>
                  { address ?
                  <div className="idcard-body dim">
                    {address}
                  </div>
                  : null }
                  { birthDate ?
                  <div className="idcard-body dim">
                    {birthDate}
                  </div>
                  : null }
                </div>
              </div>
            </div>
            <div className="container">
              {connections.length ?
              <p className="profile-foot">Connections</p>
              : null }
              {connections.map((connection, index) => {
                if (connection.id) {
                  return (
                    <Link to={`/profile/blockchain/${connection.id}`}
                      key={index} className="connections">
                      <Image src={getAvatarUrl(connection)}
                        fallbackSrc="https://s3.amazonaws.com/65m/avatar-placeholder.png"
                        style={{ width: '40px', height: '40px' }} />
                    </Link>
                  )
                }
              })}
            </div>
          </div>
          <div className="col-md-3 pull-right profile-right-col-fill">
            <div className="profile-right-col inverse">
              <ul>
                {getVerifiedAccounts(profile, verifications).map(function(account) {
                  return (
                    <SocialAccountItem
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

export default connect(mapStateToProps, mapDispatchToProps)(ViewProfilePage)
