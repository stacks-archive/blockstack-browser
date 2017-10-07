import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Person } from 'blockstack'
import ReactTooltip from 'react-tooltip'
import SecondaryNavBar from '../components/SecondaryNavBar'
import SocialAccountItem from './components/SocialAccountItem'
import PGPAccountItem from './components/PGPAccountItem'
import Modal from 'react-modal'
import Image from '../components/Image'
import { IdentityActions } from './store/identity'
import { SearchActions } from './store/search'

const placeholderImage = "https://s3.amazonaws.com/65m/avatar-placeholder.png"

function mapStateToProps(state) {
  return {
    currentIdentity: state.profiles.identity.current,
    localIdentities: state.profiles.identity.localIdentities,
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
    localIdentities: PropTypes.object.isRequired,
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
        transactionNumber: null,
        photoModalIsOpen: false
      },
      isLoading: true
    }
    this.hasUsername = this.hasUsername.bind(this)
    this.onPhotoClick = this.onPhotoClick.bind(this)
    this.openPhotoModal = this.openPhotoModal.bind(this)
    this.closePhotoModal = this.closePhotoModal.bind(this)
  }

  componentHasNewRouteParams(props) {
    if (props.routeParams.index) {
      const newDomainIndex = props.routeParams.index,
            profile = props.localIdentities[newDomainIndex].profile,
            name = props.localIdentities[newDomainIndex].domainName,
            verifications = []
      this.props.updateCurrentIdentity(name, profile, verifications)
    } else if (props.routeParams.name) {
      this.props.fetchCurrentIdentity(props.nameLookupUrl, props.routeParams.name)
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
      currentIdentity: nextProps.currentIdentity,
      isLoading: false
    })
  }

  onPhotoClick(event) {
    this.openPhotoModal(event)
  }

  openPhotoModal(event) {
    event.preventDefault()
    this.setState({
      photoModalIsOpen: true
    })
  }

  closePhotoModal(event) {
    if (event) {
      event.preventDefault()
    }
    this.setState({
      photoModalIsOpen: false
    })
  }

  hasUsername() {
    const localIdentities = this.props.localIdentities
    const currentDomainName = this.state.currentIdentity.domainName
    return currentDomainName !== localIdentities[currentDomainName].ownerAddress
  }

  render() {
    const identity = this.state.currentIdentity

    const domainName = identity.domainName

    let profile = identity.profile || null,
        verifications = identity.verifications,
        blockNumber = identity.blockNumber,
        transactionIndex = identity.transactionIndex

    let isLocal = false
    if (this.props.routeParams.hasOwnProperty('index')) {
      isLocal = true
    }

    let person = null,
        accounts = [],
        connections = []

    if (profile !== null) {
      if (profile.hasOwnProperty('@type')) {
        person = new Person(profile)
      } else {
        person = Person.fromLegacyFormat(profile)
      }
      accounts = person.profile().account || []
      connections = person.connections() || []
    }

    return (
      <div>
        { isLocal &&
        <SecondaryNavBar
          leftButtonTitle="Edit"
          leftButtonLink={`/profiles/${domainName}/edit`}
          rightButtonTitle="More" 
          rightButtonLink="/profiles/i/all" />
        }
        { person !== null ?
        <div>
          <Modal
            isOpen={this.state.photoModalIsOpen}
            contentLabel=""
            onRequestClose={this.closePhotoModal}
            shouldCloseOnOverlayClick
            style={{ overlay: { zIndex: 10 } }}
            className="container-fluid text-center"
          >
            <Image
              src={person.avatarUrl() ? person.avatarUrl() : "/images/avatar.png"}
              fallbackSrc="/images/avatar.png" className="img-fluid clickable" 
              onClick={this.closePhotoModal}/>
          </Modal>
          <ReactTooltip place="top" type="dark" effect="solid" id="domainName" className="text-center">
            <div>This is your owner address.</div>
            <div className="text-secondary">You can switch to a more meaningful name by adding an username.</div>
          </ReactTooltip>

          <div className="container-fluid m-t-50">
            <div className="row">
              <div className="col-12">

                <div className="avatar-md m-b-20 text-center">
                  <Image
                    src={person.avatarUrl() ? person.avatarUrl() : "/images/avatar.png"}
                    fallbackSrc="/images/avatar.png" className="rounded-circle clickable" 
                    onClick={this.onPhotoClick}/>
                </div>

                <div className="text-center">
                  {(blockNumber && transactionIndex) ?
                    <div className="idcard-body dim">
                      Registered in block <span>#{blockNumber}</span>,<br />
                      transaction <span>#{transactionIndex}</span>
                    </div>
                  : null}
                  <h1 className="pro-card-name text-center">{person.name()}</h1>
                  <div className="pro-card-domain-name m-b-10 text-center text-secondary">
                    {domainName} { (isLocal && !this.hasUsername()) && <span data-tip data-for="domainName">(?)</span> }
                  </div>
                  <div className="m-b-20 text-center">
                    { isLocal && !this.hasUsername() ?
                      <Link to={`/profiles/i/add-username/${domainName}/search`}
                        className="">
                       Add a username
                      </Link>
                      :
                      null
                    }
                  </div>
                  <div className="pro-card-body text-center">
                    {person.description()}
                  </div>
                  {person.address() ?
                    <div className="pro-card-body text-center text-secondary">
                    {person.address()}
                    </div>
                  : null}
                  {person.birthDate() ?
                    <div className="pro-card-body text-center">
                    {person.birthDate()}
                    </div>
                  : null}
                </div>

                <div className="text-center">
                  {connections.length ?
                    <p className="profile-foot">Connections</p>
                  : null}
                  {connections.map((connection, index) => {
                    if (connection.id) {
                      return (
                        <Link
                          to={`/profiles/blockchain/${connection.id}`}
                          key={index} className="connections" >
                          <Image
                            src={new Person(connection).avatarUrl()}
                            style={{ width: '40px', height: '40px' }} />
                        </Link>
                      )
                    } else {
                      return null
                    }
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="container-fluid">
            { isLocal ?
              (<div className="row">
                {this.hasUsername() &&
                  (<div className="col text-center">
                    <Link to={`/profiles/${domainName}/zone-file`}
                      className="btn btn-link">
                      Advanced
                    </Link>
                  </div>
                )}
                <div className="col text-center">
                  {!this.hasUsername() ?
                    (<button
                      className="btn btn-link"
                      disabled
                      title="Add a username to view publicly.">
                      View Publicly
                    </button>
                    ) : (
                    <Link to={`/profiles/${domainName}`}
                    className="btn btn-link">
                    View Publicly
                    </Link>
                    )}
                </div>
                <div className="col text-center">
                  <button
                    className="btn btn-link" onClick={this.openPasswordPrompt}>
                    + Create
                  </button>
                </div>
              </div>
              ) : (
              <div className="row">
                <div className="col text-center">
                  <button className="btn btn-link">
                    Add Friend
                  </button>
                </div>
              </div>
              )
            }
          </div>

          <div className="container-fluid p-0">
            <div className="row m-t-20 no-gutters">
              <div className="col">
                <div className="profile-accounts">
                  <ul>
                    {accounts.map((account) => {
                      let verified = false
                      for (let i = 0; i < verifications.length; i++) {
                        const verification = verifications[i]
                        if (verification.service === account.service &&
                          verification.valid === true) {
                          verified = true
                          break
                        }
                      }
                      if (account.service === 'pgp' || account.service === 'ssh' 
                        || account.service === 'bitcoin' || account.service === 'ethereum') {
                        return (
                          <PGPAccountItem
                            key={`${account.service}-${account.identifier}`}
                            service={account.service}
                            identifier={account.identifier}
                            contentUrl={account.contentUrl}
                            listItem
                          />
                        )
                      } else {
                        return (
                          <SocialAccountItem
                            key={`${account.service}-${account.identifier}`}
                            service={account.service}
                            identifier={account.identifier}
                            proofUrl={account.proofUrl}
                            listItem
                            verified={verified}
                          />
                        )
                      }
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </div>

        </div>
        :
        <div className="container-fluid m-t-50">
          <div className="row">
            <div className="col-12">
              {this.state.isLoading ?
                <h4 className="text-center">
                </h4>
              :
                <h4 className="text-center">
                  Profile not found
                </h4>
              }
            </div>
          </div>
        </div>
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
