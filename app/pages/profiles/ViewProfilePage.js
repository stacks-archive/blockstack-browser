import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Person } from 'blockstack-profiles'

import { SocialAccountItem, Image } from '../../components/index'
import { IdentityActions } from '../../store/identities'
import { SearchActions } from '../../store/search'

const placeholderImage = "https://s3.amazonaws.com/65m/avatar-placeholder.png"

function mapStateToProps(state) {
  return {
    currentIdentity: state.identities.current,
    localIdentities: state.identities.localIdentities,
    nameLookupUrl: state.settings.api.nameLookupUrl
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

  componentHasNewRouteParams(props) {
    if (props.routeParams.index) {
      const newDomainIndex = props.routeParams.index,
            profile = props.localIdentities[newDomainIndex].profile,
            name = props.localIdentities[newDomainIndex].id,
            verifications = []
      this.props.updateCurrentIdentity(name, profile, verifications)
    } else if (props.routeParams.name) {
      this.props.fetchCurrentIdentity(props.routeParams.name, props.nameLookupUrl)
    }
  }

  componentWillMount() {
    this.componentHasNewRouteParams(this.props)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.routeParams !== this.props.routeParams) {
      this.componentHasNewRouteParams(nextProps)
    }
    this.setState({
      currentIdentity: nextProps.currentIdentity
    })
  }

  render() {
    let identity = this.state.currentIdentity,
        blockchainId = identity.id

    let profile = identity.profile,
        verifications = identity.verifications,
        blockNumber = identity.blockNumber,
        transactionIndex = identity.transactionIndex

    let isLocal = false
    if (this.props.routeParams.hasOwnProperty('index')) {
      isLocal = true
    }

    let person = new Person(profile)

    let accounts = person.profile().account || []

    return (
      <div className="container-fluid proid-wrap p-t-4">
        { person !== null ?
        <div>
          <div className="col-sm-9">
            <div className="container">
              <div className="profile-container col-sm-6 center-block">
                  <div className="profile-wrap">
                    <div className="idcard-block">
                      <div className="id-flex">
                        <Image src={person.avatarUrl() || ''}
                          fallbackSrc={placeholderImage} className="img-idcard" />
                        <div className="overlay"></div>
                      </div>
                    </div>
                  </div>
                { isLocal ?
                <div>
                  <Link to={this.props.location.pathname + "/edit"}
                    className="btn btn-block btn-primary m-t-1">
                    Edit
                  </Link>
                </div>
                :
                <div>
                  <button className="btn btn-block btn-primary m-t-1">
                    Connect
                  </button>
                </div>
                }
              </div>
              <div className="col-sm-6">
                <div className="idcard-wrap">
                  { (blockNumber && transactionIndex) ?
                  <div className="idcard-body dim">
                    Registered in block <span className="inverse">#{blockNumber}</span>,<br/>
                    transaction <span className="inverse">#{transactionIndex}</span>
                  </div>
                  : null }
                  <h1 className="idcard-name">{person.name()}</h1>
                  <div className="idcard-body inverse">
                    {person.description()}
                  </div>
                  { person.address() ?
                  <div className="idcard-body dim">
                    {person.address()}
                  </div>
                  : null }
                  { person.birthDate() ?
                  <div className="idcard-body dim">
                    {person.birthDate()}
                  </div>
                  : null }
                </div>
              </div>
            </div>
            <div className="container">
              {person.connections().length ?
              <p className="profile-foot">Connections</p>
              : null }
              {person.connections().map((connection, index) => {
                if (connection.id) {
                  return (
                    <Link to={`/profile/blockchain/${connection.id}`}
                      key={index} className="connections">
                      <Image src={new Profile(connection).avatarUrl()}
                        fallbackSrc={placeholderImage}
                        style={{ width: '40px', height: '40px' }} />
                    </Link>
                  )
                }
              })}
            </div>
          </div>
          <div className="col-sm-3 pull-right profile-right-col-fill">
            <div className="profile-right-col inverse">
              <ul>
                {accounts.map(function(account) {
                  let verified = false
                  if (account.proofUrl && account.proofUrl !== "") {
                    verified = true
                  }
                  return (
                    <SocialAccountItem
                      key={account.service + '-' + account.identifier}
                      service={account.service}
                      identifier={account.identifier}
                      proofUrl={account.proofUrl}
                      listItem={true}
                      verified={verified} />
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

/*
  componentWillUnmount() {
    this.props.updateCurrentIdentity('', {}, [])
  }
*/