import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Person } from 'blockstack'
import Modal from 'react-modal'
import SecondaryNavBar from '../components/SecondaryNavBar'
import Image from '../components/Image'
import { IdentityActions } from './store/identity'
import { AccountActions }  from '../account/store/account'
import SocialAccountItem from './components/SocialAccountItem'
import PGPAccountItem from './components/PGPAccountItem'
import InputGroup from '../components/InputGroup'
import ToolTip from '../components/ToolTip'

import log4js from 'log4js'

const logger = log4js.getLogger('profiles/DefaultProfilePage.js')

const accountTypes = [
  'twitter',
  'facebook',
  'linkedIn',
  'github',
  'instagram',
  'hackerNews',
  'bitcoin',
  'ethereum',
  'pgp',
  'ssh'
]

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
    localIdentities: PropTypes.array.isRequired,
    defaultIdentity: PropTypes.number.isRequired,
    createNewProfile: PropTypes.func.isRequired,
    updateProfile: PropTypes.func.isRequired,
    refreshIdentities: PropTypes.func.isRequired,
    refreshSocialProofVerifications: PropTypes.func.isRequired,
    api: PropTypes.object.isRequired,
    identityAddresses: PropTypes.array.isRequired,
    nextUnusedAddressIndex: PropTypes.number.isRequired,
    encryptedBackupPhrase: PropTypes.string.isRequired,
    setDefaultIdentity: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    const identityIndex = this.props.defaultIdentity
    const identity = this.props.localIdentities[identityIndex]

    this.state = {
      profile: identity.profile,
      localIdentities: this.props.localIdentities,
      editMode: false,
      photoModalIsOpen: false
    }

    this.onEditClick = this.onEditClick.bind(this)
    this.onValueChange = this.onValueChange.bind(this)
    this.availableIdentityAddresses = this.availableIdentityAddresses.bind(this)
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
  }

  onEditClick(event) {
    if (this.state.editMode) {
      this.setState({
        editMode: false
      })
    } else {
      this.setState({
        editMode: true
      })
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

  onChangePhotoClick = () => {
    this.photoUpload.click()
  }

  uploadProfilePhoto = (e) => {
    const identityIndex = this.state.index
    const identity = this.props.localIdentities[identityIndex]
    const ownerAddress = identity.ownerAddress
    const profile = this.state.profile
    const photoIndex = 0
    logger.debug('uploadProfilePhoto: trying to upload...')
    if (this.props.storageConnected) {
      uploadPhoto(this.props.api, identityIndex, ownerAddress, e.target.files[0], photoIndex)
      .then((avatarUrl) => {
        logger.debug(`uploadProfilePhoto: uploaded photo: ${avatarUrl}`)
        profile.image = []
        profile.image.push({
          '@type': 'ImageObject',
          name: 'avatar',
          contentUrl: avatarUrl
        })
        this.setState({
          profile
        })
      })
      .catch((error) => {
        console.error(error)
      })
    } else {
      logger.error('uploadProfilePhoto: storage is not connected. Doing nothing.')
    }
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

  availableIdentityAddresses() {
    return this.props.nextUnusedAddressIndex + 1 <= this.props.identityAddresses.length
  }

  createNewAccount(service, identifier) {
    return {
      '@type': 'Account',
      placeholder: false,
      service,
      identifier,
      proofType: 'http',
      proofUrl: ''
    }
  }

  createPlaceholderAccount(accountType) {
    return {
      '@type': 'Account',
      placeholder: true,
      service: accountType,
      identifier: '',
      proofType: '',
      proofURL: ''
    }
  }

  render() {
    const identityIndex = this.props.defaultIdentity
    const identity = this.state.localIdentities[identityIndex]
    const person = new Person(identity.profile)

    if (identity.username) {
      identity.canAddUsername = false
    } else {
      identity.canAddUsername = true
    }

    const ownerAddress = identity.ownerAddress
    const verifications = identity.verifications
    const trustLevel = identity.trustLevel
    const blockNumber = identity.blockNumber
    const transactionIndex = identity.transactionIndex

    const filledAccounts = []
    const placeholders = []

    if (this.state.profile.hasOwnProperty('account')) {
      accountTypes.forEach((accountType) => {
        let hasAccount = false
        this.state.profile.account.forEach((account) => {
          if (account.service === accountType) {
            hasAccount = true
            account.placeholder = false
            filledAccounts.push(account)
          }
        })

        if (!hasAccount) {
          placeholders.push(this.createPlaceholderAccount(accountType))
        }
      })
    } else {
      accountTypes.forEach((accountType) => {
        placeholders.push(this.createPlaceholderAccount(accountType))
      })
    }

    // const accounts = person.profile().account || []
    const accounts = filledAccounts.concat(placeholders)
    const connections = person.connections() || []

    return (
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
            src={person.avatarUrl() ? person.avatarUrl() : '/images/avatar.png'}
            fallbackSrc="/images/avatar.png" className="img-fluid clickable"
            onClick={this.closePhotoModal}
          />
        </Modal>

        <Modal
          isOpen={this.state.photoModalIsOpen}
          contentLabel=""
          onRequestClose={this.closePhotoModal}
          shouldCloseOnOverlayClick={false}
          style={{ overlay: { zIndex: 10 } }}
          className="container-fluid text-center"
        >
          Social account modal
        </Modal>

        <ToolTip id="ownerAddress">
          <div>
            <div>This is your identity address.</div>
          </div>
        </ToolTip>
        <ToolTip id="usernamePending">
          <div>
            <div>Name registration in progress...</div>
          </div>
        </ToolTip>
        <ToolTip id="trustLevel">
          <div>
            <div>Increase your trust level by verifying your social proofs.</div>
          </div>
        </ToolTip>
        <div>
          <SecondaryNavBar
            leftButtonTitle={this.state.editMode ? "Save" : "Edit"}
            onLeftButtonClick={this.onEditClick}
            rightButtonTitle={this.state.editMode ? "Cancel" : "More"}
            rightButtonLink="/profiles/i/all"
          />
          <div className="container-fluid m-t-50 p-0">
            <div className="row">
              <div className="col-12">

                <div className="avatar-md m-b-0 text-center">
                  <Image
                    src={person.avatarUrl() ? person.avatarUrl() : '/images/avatar.png'}
                    fallbackSrc="/images/avatar.png" className="rounded-circle clickable"
                    onClick={this.onPhotoClick}
                  />
                </div>
              </div>

              {this.state.editMode &&
              <div className="col-12 text-center">
                <input
                  type="file"
                  ref={(ref) => { this.photoUpload = ref }}
                  onChange={this.uploadProfilePhoto}
                  style={{ display: 'none' }}
                />
                <button
                  className="btn btn-link active"
                  onClick={this.onChangePhotoClick}
                >
                    Change Photo
                </button>
              </div>
              }

              {this.state.editMode ? 
                <div className="col-12">
                  <InputGroup
                    name="name"
                    label="Full Name"
                    data={this.state.profile}
                    onChange={this.onChange}
                  />
                  <InputGroup
                    name="description"
                    label="Short Bio"
                    data={this.state.profile}
                    onChange={this.onChange}
                  />
                </div>
              :
                <div className="col-12">
                  <div className="text-center">
                    {/* {(blockNumber && transactionIndex) ?
                      <div className="idcard-body dim">
                        Registered in block <span>#{blockNumber}</span>,<br />
                        transaction <span>#{transactionIndex}</span>
                      </div>
                    : null}*/}
                    <div className="pro-card-name text-center m-t-30">{person.name()}</div>
                    <div className="text-center">
                      {identity.canAddUsername ?
                        <Link to={`/profiles/i/add-username/${identityIndex}/search`}>
                         Add a username
                        </Link>
                      :
                        <div className="pro-card-domain-name text-center text-secondary m-t-0">
                          <span>{identity.username}</span>
                          {identity.usernamePending ?
                            <i
                              className="fa fa-fw fa-clock-o fa-lg"
                              data-tip
                              data-for="usernamePending"
                            ></i>
                            : null}
                        </div>
                    }
                    </div>

                    <div className="pro-card-identity-address m-b-25 text-center text-secondary m-t-0">
                      <small>
                        <span data-tip data-for="ownerAddress">
                          {`ID-${identity.ownerAddress}`}
                        </span>
                      </small>
                    </div>

                    <div className="pro-card-body text-center">
                      {person.description()}
                    </div>

                    {/*}
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
                    */}
                  </div>

                  {/* <div className="text-center">
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
                  </div>*/}
                </div>
              }
            </div>

          </div>

          <div className="container-fluid p-0">
            <div className="row">
              <div className="col-12">

                <div className="pro-card-trust-level text-center m-t-25 m-b-30">
                  <span className="pro-card-trust-level-badge">
                    {trustLevel >= 3 && <i className="fa fa-lg fa-check-circle" />}
                    <span className="pro-card-trust-level">Trust Level: {trustLevel} </span>
                    {trustLevel <= 1 &&
                      <span data-tip data-for="trustLevel">
                        <i className="fa fa-info-circle" />
                      </span>
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="container-fluid p-0">
            <div className="row m-t-30 no-gutters">
              <div className="col">
                <div className="profile-accounts">
                  <ul>
                    {accounts.map((account) => {
                      let verified = false
                      let pending = false
                      if (verifications.length > 0) {
                        for (let i = 0; i < verifications.length; i++) {
                          const verification = verifications[i]
                          if (verification.service === account.service &&
                            verification.valid === true) {
                            verified = true
                            pending = false
                            break
                          }
                        }
                      } else {
                        pending = true
                      }

                      if (account.service === 'pgp' || account.service === 'ssh'
                        || account.service === 'bitcoin' || account.service === 'ethereum') {
                        return (
                          <PGPAccountItem
                            key={`${account.service}-${account.identifier}`}
                            service={account.service}
                            identifier={account.identifier}
                            contentUrl={account.contentUrl}
                            placeholder={account.placeholder}
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
                            placeholder={account.placeholder}
                            pending={pending}
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
