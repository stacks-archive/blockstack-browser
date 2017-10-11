import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Person } from 'blockstack'
import Modal from 'react-modal'
import SecondaryNavBar from '../components/SecondaryNavBar'
import Alert from '../components/Alert'
import Image from '../components/Image'
import InputGroup from '../components/InputGroup'
import { IdentityActions } from './store/identity'
import { AccountActions }  from '../account/store/account'
import SocialAccountItem from './components/SocialAccountItem'
import PGPAccountItem from './components/PGPAccountItem'
import ToolTip from '../components/ToolTip'

import log4js from 'log4js'

const logger = log4js.getLogger('profiles/DefaultProfilePage.js')

function mapStateToProps(state) {
  return {
    localIdentities: state.profiles.identity.localIdentities,
    defaultIdentity: state.profiles.identity.default,
    namesOwned: state.profiles.identity.namesOwned,
    createProfileError: state.profiles.identity.createProfileError,
    identityAddresses: state.account.identityAccount.addresses,
    nextUnusedAddressIndex: state.account.identityAccount.addressIndex,
    api: state.settings.api,
    encryptedBackupPhrase: state.account.encryptedBackupPhrase
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, IdentityActions, AccountActions), dispatch)
}

class DefaultProfilePage extends Component {
  static propTypes = {
    localIdentities: PropTypes.object.isRequired,
    defaultIdentity: PropTypes.string.isRequired,
    createNewProfile: PropTypes.func.isRequired,
    refreshIdentities: PropTypes.func.isRequired,
    namesOwned: PropTypes.array.isRequired,
    api: PropTypes.object.isRequired,
    identityAddresses: PropTypes.array.isRequired,
    nextUnusedAddressIndex: PropTypes.number.isRequired,
    encryptedBackupPhrase: PropTypes.string.isRequired,
    setDefaultIdentity: PropTypes.func.isRequired,
    resetCreateNewProfileError: PropTypes.func.isRequired,
    createProfileError: PropTypes.string
  }

  constructor(props) {
    super(props)

    this.state = {
      localIdentities: this.props.localIdentities,
      passwordPromptIsOpen: false,
      processing: false,
      password: '',
      photoModalIsOpen: false
    }

    this.onValueChange = this.onValueChange.bind(this)
    this.availableIdentityAddresses = this.availableIdentityAddresses.bind(this)
    this.openPasswordPrompt = this.openPasswordPrompt.bind(this)
    this.closePasswordPrompt = this.closePasswordPrompt.bind(this)
    this.onPhotoClick = this.onPhotoClick.bind(this)
    this.openPhotoModal = this.openPhotoModal.bind(this)
    this.closePhotoModal = this.closePhotoModal.bind(this)
  }

  componentWillMount() {
    logger.trace('componentWillMount')
    this.props.refreshIdentities(
      this.props.api,
      this.props.identityAddresses
    )
  }

  componentWillReceiveProps(nextProps) {
    logger.trace('componentWillReceiveProps')
    this.setState({
      localIdentities: nextProps.localIdentities
    })
    if (nextProps.createProfileError) {
      this.setState({
        processing: false
      })
    }

    const currentIdentityCount = Object.keys(this.props.localIdentities).length

    const newIdentityCount = Object.keys(nextProps.localIdentities).length
    if (currentIdentityCount < newIdentityCount) {
      this.setState({
        processing: false,
        password: ''
      })
      this.closePasswordPrompt()
    }
  }

  onValueChange(event) {
    this.setState({
      [event.target.name]: event.target.value
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

  openPasswordPrompt(event) {
    event.preventDefault()
    this.setState({
      processing: false
    })
    this.props.resetCreateNewProfileError()
    this.setState({
      passwordPromptIsOpen: true
    })
  }

  closePasswordPrompt(event) {
    if (event) {
      event.preventDefault()
    }
    this.setState({
      passwordPromptIsOpen: false
    })
  }

  availableIdentityAddresses() {
    return this.props.nextUnusedAddressIndex + 1 <= this.props.identityAddresses.length
  }

  render() {
    const createProfileError = this.props.createProfileError
    const passwordPromptIsOpen = this.state.passwordPromptIsOpen
    const identityIndex = this.props.defaultIdentity
    const identity = this.state.localIdentities[identityIndex]
    const person = new Person(identity.profile)

    if (identity.username) {
      identity.canAddUsername = false
    } else {
      identity.canAddUsername = true
    }

    const verifications = identity.verifications
    const blockNumber = identity.blockNumber
    const transactionIndex = identity.transactionIndex

    const accounts = person.profile().account || []
    const connections = person.connections() || []

    return (
      <div>
        <Modal
          isOpen={passwordPromptIsOpen}
          onRequestClose={this.closePasswordPrompt}
          contentLabel="Password Modal"
          shouldCloseOnOverlayClick
          style={{ overlay: { zIndex: 10 } }}
          className="container-fluid"
        >
          <form onSubmit={this.createNewProfile}>
            <h3 className="modal-heading">Enter your password to create a new Blockstack ID</h3>
            <div>
              {createProfileError ?
                <Alert key="1" message="Incorrect password" status="danger" />
                :
                null
              }
            </div>
            <InputGroup
              name="password"
              type="password"
              label=""
              placeholder="Password"
              data={this.state}
              onChange={this.onValueChange}
              required
            />
            <button
              disabled={this.state.processing}
              className="btn btn-primary btn-block"
              type="submit"
            >
              {this.state.processing ?
                <span>Creating...</span>
                :
                <span>Create new ID</span>
              }
            </button>
          </form>
        </Modal>
        <Modal
          isOpen={this.state.photoModalIsOpen}
          contentLabel=""
          onRequestClose={this.closePhotoModal}
          shouldCloseOnOverlayClick
          style={{ overlay: { zIndex: 10 } }}
          className="container-fluid text-center"
        >
          <Image
            src={person.avatarUrl() ? person.avatarUrl() : '/images/avatar.png'}
            fallbackSrc="/images/avatar.png" className="img-fluid clickable"
            onClick={this.closePhotoModal}
          />
        </Modal>
        <ToolTip id="ownerAddress">
          <div>
            <div>This is your owner address.</div>
            <div className="text-secondary">
              You can switch to a more meaningful name by adding an username.
            </div>
          </div>
        </ToolTip>
        <div>
          <SecondaryNavBar
            leftButtonTitle="Edit"
            leftButtonLink={`/profiles/${identityIndex}/edit`}
            centerButtonTitle="View"
            centerButtonLink="/profiles"
            isCenterActive
            rightButtonTitle="More"
            rightButtonLink="/profiles/i/all"
          />
          <div className="container-fluid m-t-50">
            <div className="row">
              <div className="col-12">

                <div className="avatar-md m-b-20 text-center">
                  <Image
                    src={person.avatarUrl() ? person.avatarUrl() : '/images/avatar.png'}
                    fallbackSrc="/images/avatar.png" className="rounded-circle clickable"
                    onClick={this.onPhotoClick}
                  />
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
                    {identity.ownerAddress} {identity.canAddUsername &&
                      <span data-tip data-for="ownerAddress">(?)</span>}
                  </div>
                  <div className="m-b-20 text-center">
                    {identity.canAddUsername ?
                      <Link to={`/profiles/i/add-username/${identityIndex}/search`}>
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
                          key={index} className="connections"
                        >
                          <Image
                            src={new Person(connection).avatarUrl()}
                            style={{ width: '40px', height: '40px' }}
                          />
                        </Link>
                      )
                    } else {
                      return null
                    }
                  })}
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col text-center">

              </div>
              <div className="col text-center">

              </div>
            </div>

          </div>

          <div className="container-fluid p-0">
            <div className="row m-t-20 no-gutters">
              <div className="col">
                <div className="profile-accounts">
                  <ul>
                    {accounts.map((account) => {
                      let verified = false
                      if (verifications) {
                        for (let i = 0; i < verifications.length; i++) {
                          const verification = verifications[i]
                          if (verification.service === account.service &&
                            verification.valid === true) {
                            verified = true
                            break
                          }
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
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DefaultProfilePage)
