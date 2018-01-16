import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import InputGroup from '../components/InputGroup'
import Image from '../components/Image'
import SecondaryNavBar from '../components/SecondaryNavBar'
import { IdentityActions } from './store/identity'
import { uploadProfile, uploadPhoto } from '../account/utils'
import { openInNewTab, signProfileForUpload } from '../utils'
import Modal from 'react-modal'
import EditSocialAccountItem from './components/EditSocialAccountItem'
import EditPGPAccountItem from './components/EditPGPAccountItem'
import { Person } from 'blockstack'

import log4js from 'log4js'

const logger = log4js.getLogger('profiles/EditProfilePage.js')

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
    api: state.settings.api,
    identityKeypairs: state.account.identityAccount.keypairs,
    identityAddresses: state.account.identityAccount.addresses,
    storageConnected: state.settings.api.storageConnected
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(IdentityActions, dispatch)
}

class EditProfilePage extends Component {
  static propTypes = {
    updateProfile: PropTypes.func.isRequired,
    localIdentities: PropTypes.array.isRequired,
    api: PropTypes.object.isRequired,
    identityAddresses: PropTypes.array.isRequired,
    identityKeypairs: PropTypes.array.isRequired,
    routeParams: PropTypes.object.isRequired,
    refreshSocialProofVerifications: PropTypes.func.isRequired,
    refreshIdentities: PropTypes.func.isRequired,
    storageConnected: PropTypes.bool.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      profile: null,
      profileJustSaved: false,
      tabName: '',
      photoModalIsOpen: false
    }

    this.saveProfile = this.saveProfile.bind(this)
    this.uploadProfilePhoto = this.uploadProfilePhoto.bind(this)
    this.hasUsername = this.hasUsername.bind(this)
    this.onChange = this.onChange.bind(this)
    this.onSocialAccountChange = this.onSocialAccountChange.bind(this)
    this.onSocialAccountProofUrlChange = this.onSocialAccountProofUrlChange.bind(this)
    this.onSocialAccountBlur = this.onSocialAccountBlur.bind(this)
    this.onSocialAccountDelete = this.onSocialAccountDelete.bind(this)
    this.refreshProofs = this.refreshProofs.bind(this)
    this.onPhotoClick = this.onPhotoClick.bind(this)
    this.onChangePhotoClick = this.onChangePhotoClick.bind(this)
    this.createNewAccount = this.createNewAccount.bind(this)
    this.removeAccount = this.removeAccount.bind(this)
    this.openPhotoModal = this.openPhotoModal.bind(this)
    this.closePhotoModal = this.closePhotoModal.bind(this)
    this.onVerifyButtonClick = this.onVerifyButtonClick.bind(this)
  }

  componentWillMount() {
    this.componentHasNewLocalIdentities(this.props)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.localIdentities !== this.props.localIdentities) {
      this.componentHasNewLocalIdentities(nextProps)
    }
  }

  componentWillUnmount() {
    this.saveProfile(this.state.profile)
  }

  onChange(event) {
    const profile = this.state.profile
    profile[event.target.name] = event.target.value
    this.setState({ profile })
  }

  onPhotoClick(event) {
    this.openPhotoModal(event)
  }

  onChangePhotoClick() {
    this.photoUpload.click()
  }

  onVerifyButtonClick(event, service, identifier) {
    const profileIndex = this.props.routeParams.index
    const identity = this.props.localIdentities[profileIndex]

    const verificationText =
    `Verifying my Blockstack ID is secured with the address ${identity.ownerAddress}`
    let verificationUrl = ''

    if (service === 'twitter') {
      verificationUrl = `https://twitter.com/intent/tweet?text=${verificationText}`
    } else if (service === 'facebook') {
      verificationUrl = 'https://www.facebook.com/dialog/feed?app_id=258121411364320'
    } else if (service === 'github') {
      verificationUrl = 'https://gist.github.com/'
    } else if (service === 'instagram') {
      // no op
    } else if (service === 'linkedIn') {
      verificationUrl = 'https://www.linkedin.com/feed/'
      // verificationUrl = `https://www.linkedin.com/shareArticle?mini=true&url=http://www.blockstack.org&title=${verificationText}`
    } else if (service === 'hackerNews') {
      verificationUrl = `https://news.ycombinator.com/user?id=${identifier}`
    }

    if (verificationUrl.length > 0) {
      openInNewTab(verificationUrl)
    }
  }

  onSocialAccountChange(service, identifier) {
    const profile = this.state.profile

    if (!profile.hasOwnProperty('account')) {
      profile.account = []
    }

    if (profile.hasOwnProperty('account')) {
      let hasAccount = false
      profile.account.forEach(account => {
        if (account.service === service) {
          hasAccount = true
          account.identifier = identifier
          if (this.shouldAutoGenerateProofUrl(service)) {
            account.proofUrl = this.generateProofUrl(service, identifier)
          }
          this.setState({ profile })
          this.refreshProofs()
        }
      })

      if (!hasAccount && identifier.length > 0) {
        const newAccount = this.createNewAccount(service, identifier)
        if (this.shouldAutoGenerateProofUrl(service)) {
          newAccount.proofUrl = this.generateProofUrl(service, identifier)
        }
        profile.account.push(newAccount)
        this.setState({ profile })
        this.refreshProofs()
      }
    }
  }

  onSocialAccountProofUrlChange(service, proofUrl) {
    const profile = this.state.profile

    if (profile.hasOwnProperty('account')) {
      profile.account.forEach(account => {
        if (account.service === service) {
          account.proofUrl = proofUrl
          this.setState({ profile })
          this.refreshProofs()
        }
      })
    }
  }

  onSocialAccountBlur(event, service) {
    const profile = this.state.profile

    if (event.target.name === 'identifier') {
      const identifier = event.target.value

      this.saveProfile(profile)

      if (identifier.length === 0) {
        this.removeAccount(service)
      }
    } else if (event.target.name === 'proofUrl') {
      if (this.hasUsername() && this.props.storageConnected) {
        this.refreshProofs()
      }
    }
  }

  onSocialAccountDelete(service) {
    this.removeAccount(service)
  }

  shouldAutoGenerateProofUrl(service) {
    return service === 'hackerNews'
  }

  generateProofUrl(service, identifier) {
    if (service === 'hackerNews') {
      return `https://news.ycombinator.com/user?id=${identifier}`
    }

    return ''
  }

  componentHasNewLocalIdentities(props) {
    logger.trace('componentHasNewLocalIdentities')
    const identityIndex = this.props.routeParams.index
    if (props.localIdentities[identityIndex]) {
      logger.trace('componentHasNewLocalIdentities: identity found')
      const newIndex = identityIndex
      const newProfile = props.localIdentities[identityIndex].profile
      const newUsername = props.localIdentities[identityIndex].username
      // newProfile.verifications = props.localIdentities[profileIndex].verifications

      this.setState({
        index: newIndex,
        profile: newProfile,
        username: newUsername
      })
    } else {
      logger.trace('componentHasNewLocalIdentities: no identity found')
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

  saveProfile(newProfile) {
    logger.trace('saveProfile')

    const identityIndex = this.props.routeParams.index
    const identity = this.props.localIdentities[identityIndex]
    const verifications = identity.verifications
    const trustLevel = identity.trustLevel

    this.props.updateProfile(this.props.routeParams.index, newProfile, verifications, trustLevel)
    logger.trace('saveProfile: Preparing to upload profile')
    logger.debug(`saveProfile: signing with key index ${identityIndex}`)

    const identitySigner = this.props.identityKeypairs[identityIndex]
    const signedProfileTokenData = signProfileForUpload(this.state.profile, identitySigner)
    if (this.props.storageConnected) {
      uploadProfile(this.props.api, identity, identitySigner, signedProfileTokenData)
      .catch((err) => {
        logger.error('saveProfile: profile not uploaded', err)
      })
    } else {
      logger.debug('saveProfile: storage is not connected. Doing nothing.')
    }
  }

  uploadProfilePhoto(e) {
    const identityIndex = this.state.index
    const identitySigner = this.props.identityKeypairs[identityIndex]
    const identity = this.props.localIdentities[identityIndex]
    const profile = this.state.profile
    const photoIndex = 0
    logger.debug('uploadProfilePhoto: trying to upload...')
    if (this.props.storageConnected) {
      uploadPhoto(this.props.api, identity, identitySigner, e.target.files[0], photoIndex)
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

  hasUsername() {
    const localIdentities = this.props.localIdentities
    const identityIndex = this.state.index
    return !!localIdentities[identityIndex].username
  }

  removeAccount(service) {
    const profile = this.state.profile
    const accounts = profile.account

    if (accounts) {
      const newAccounts = accounts.filter(account => account.service !== service)
      profile.account = newAccounts
      this.setState({ profile })
      this.saveProfile(profile)
      this.refreshProofs()
    }
  }

  refreshProofs() {
    const profile = this.state.profile
    const identityIndex = this.props.routeParams.index
    const identity = this.props.localIdentities[identityIndex]
    const identityAddress = identity.ownerAddress
    const username = identity.username

    this.props.refreshSocialProofVerifications(identityIndex, identityAddress, username, profile)
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
    const profileIndex = this.props.routeParams.index
    const identity = this.props.localIdentities[profileIndex]
    const verifications = identity.verifications
    const person = new Person(this.state.profile)
    // render() sometimes gets called before defaultIdentityName
    // is updated from ownerAddress to the actual name when adding
    // a username.
    if (!identity) {
      return null
    }

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

    const accounts = filledAccounts.concat(placeholders)
    const ownerAddress = identity.ownerAddress
    const identityIndex = this.state.index
    return (
      <div>
      {this.state.tabName === '' ? (
        <SecondaryNavBar
          leftButtonTitle="Edit"
          leftButtonLink={`/profiles/${identityIndex}/edit`}
          isLeftActive
          centerButtonTitle="View"
          centerButtonLink="/profiles"
          rightButtonTitle="More"
          rightButtonLink="/profiles/i/all"
        />
        ) : (
        <SecondaryNavBar
          leftButtonTitle="Edit"
          leftIsButton
          onLeftButtonClick={() => this.backClick()}
          isLeftActive
          centerButtonTitle="View"
          centerButtonLink="/profiles"
          rightButtonTitle="More"
          rightButtonLink="/profiles/i/all"
        />
        )}

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
            fallbackSrc="/images/avatar.png"
            className="img-fluid clickable"
            onClick={this.closePhotoModal}
          />
        </Modal>

        <div>
          {this.state.profile ?
            <div>
              <div className="container-fluid no-padding">
                <div className="row no-gutters">

                  <div className="col-12">
                    <div className="avatar-md m-t-50 m-b-10 text-center">
                      <Image
                        src={person.avatarUrl() ? person.avatarUrl() : '/images/avatar.png'}
                        fallbackSrc="/images/avatar.png"
                        className="rounded-circle clickable"
                        onClick={this.onPhotoClick}
                      />
                    </div>
                  </div>
                  <div className="col-12 text-center">
                    <input
                      type="file"
                      ref={(ref) => { this.photoUpload = ref }}
                      onChange={this.uploadProfilePhoto}
                      style={{ display: 'none' }}
                    />
                    <button
                      className="btn btn-link active m-b-30"
                      onClick={this.onChangePhotoClick}
                    >
                        Change Photo
                    </button>
                  </div>

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
                </div>
              </div>


              <div className="container-fluid p-0">
                <div className="row m-t-20 p-b-45 no-gutters">
                  <div className="col-12">
                    <div className="edit-profile-accounts">
                      {accounts &&
                        accounts.map((account) => {
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
                              <EditPGPAccountItem
                                key={`${account.service}`}
                                service={account.service}
                                identifier={account.identifier}
                                ownerAddress={ownerAddress}
                                contentUrl={account.contentUrl}
                                placeholder={account.placeholder}
                                onChange={this.onSocialAccountChange}
                                onBlur={this.onSocialAccountBlur}
                                listItem
                              />
                            )
                          } else {
                            return (
                              <EditSocialAccountItem
                                key={`${account.service}`}
                                service={account.service}
                                identifier={account.identifier}
                                ownerAddress={ownerAddress}
                                proofUrl={account.proofUrl}
                                listItem
                                verified={verified}
                                placeholder={account.placeholder}
                                onChange={this.onSocialAccountChange}
                                onProofUrlChange={this.onSocialAccountProofUrlChange}
                                onBlur={this.onSocialAccountBlur}
                                onVerifyButtonClick={this.onVerifyButtonClick}
                                onDelete={this.onSocialAccountDelete}
                              />
                            )
                          }
                        })
                      }

                    </div>
                  </div>
                </div>
              </div>


            </div>
          :
            <div>
              <h1 className="h1-modern vertical-split-content">
                Page Not Found
              </h1>
              <p>You don't own this profile and therefore you cannot edit it.</p>
            </div>
          }
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditProfilePage)
