import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Person } from 'blockstack'
import Modal from 'react-modal'
import Image from '@components/Image'
import { IdentityActions } from './store/identity'
import { AccountActions } from '../account/store/account'
import SecondaryNavBar from '@components/SecondaryNavBar'
import SocialAccountItem from './components/SocialAccountItem'
import PGPAccountItem from './components/PGPAccountItem'
import ProfileCompletion from './components/ProfileCompletion'
import InputGroup from '@components/InputGroup'
import ToolTip from '@components/ToolTip'
import EditSocialAccount from './components/EditSocialAccount'
import EditAccount from './components/EditAccount'
import PhotoModal from './components/PhotoModal'
import { UserAvatar } from '@blockstack/ui'
import nodeUrl from 'url'

import { uploadProfile } from '../account/utils'
import {
  openInNewTab,
  isMobile,
  signProfileForUpload,
  calculateProfileCompleteness
} from '../utils'
import { VERIFICATION_TWEET_LINK_URL_BASE } from './components/VerificationInfo'

import log4js from 'log4js'
import { defaultAvatarImage } from '@components/ui/common/constants'

const logger = log4js.getLogger(__filename)

const accountTypes = [
  'twitter',
  'facebook',
  'github',
  'hackerNews',
  'bitcoin',
  'ethereum',
  'pgp',
  'ssh',
  'linkedIn',
  'instagram'
]

const hiddenAccountTypes = ['linkedIn', 'instagram']

function mapStateToProps(state) {
  return {
    localIdentities: state.profiles.identity.localIdentities,
    defaultIdentity: state.profiles.identity.default,
    namesOwned: state.profiles.identity.namesOwned,
    createProfileError: state.profiles.identity.createProfileError,
    identityKeypairs: state.account.identityAccount.keypairs,
    identityAddresses: state.account.identityAccount.addresses,
    storageConnected: state.settings.api.storageConnected,
    nextUnusedAddressIndex: state.account.identityAccount.addressIndex,
    api: state.settings.api,
    encryptedBackupPhrase: state.account.encryptedBackupPhrase
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    Object.assign({}, IdentityActions, AccountActions),
    dispatch
  )
}

// Named export to test the Component in isolation
export class DefaultProfilePage extends Component {
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
    setDefaultIdentity: PropTypes.func.isRequired,
    identityKeypairs: PropTypes.array.isRequired,
    storageConnected: PropTypes.bool.isRequired
  }

  constructor(props) {
    super(props)

    const identityIndex = this.props.defaultIdentity
    const identity = this.props.localIdentities[identityIndex]

    this.state = {
      profile: identity.profile,
      localIdentities: this.props.localIdentities,
      editMode: false,
      photoModalIsOpen: false,
      socialAccountEditIsOpen: false,
      accountEditIsOpen: false,
      editingSocialAccount: {},
      editingAccount: {},
      showHiddenPlaceholders: false,
      avatarCacheBust: ''
    }
  }

  componentWillMount() {
    logger.info('componentWillMount')
    this.props.refreshIdentities(this.props.api, this.props.identityAddresses)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.localIdentities !== this.props.localIdentities) {
      this.componentHasNewLocalIdentities(nextProps)
    }
  }

  onEditClick = () => {
    if (this.state.editMode) {
      this.setState({
        editMode: false
      })
    } else {
      const profile = this.state.profile
      this.setState({
        editMode: true,
        name: profile.name,
        description: profile.description
      })
    }
  }

  onSaveClick = () => {
    const { profile, name, description } = this.state
    this.saveProfile({
      ...profile,
      name,
      description
    })
    this.setState({
      editMode: false
    })
  }

  onCancelClick = () => {
    this.setState({
      editMode: false
    })
  }

  onSocialAccountClick = service => {
    if (this.state.socialAccountEditIsOpen) {
      this.setState({
        socialAccountEditIsOpen: false,
        editingSocialAccount: {}
      })
    } else {
      let editingAccount = null

      if (this.state.profile.account) {
        this.state.profile.account.forEach(account => {
          if (account.service === service) {
            editingAccount = account
          }
        })
      }

      if (!editingAccount) {
        editingAccount = {
          '@type': 'Account',
          placeholder: false,
          service,
          identifier: '',
          proofType: 'http',
          proofUrl: ''
        }
      }

      if (isMobile()) {
        window.scrollTo(0, 0)
      }

      this.setState({
        socialAccountEditIsOpen: true,
        editingSocialAccount: editingAccount
      })
    }
  }

  onAccountClick = service => {
    if (this.state.accountEditIsOpen) {
      this.setState({
        accountEditIsOpen: false,
        editingAccount: {}
      })
    } else {
      let editingAccount = null

      if (this.state.profile.account) {
        this.state.profile.account.forEach(account => {
          if (account.service === service) {
            editingAccount = account
          }
        })
      }

      if (!editingAccount) {
        editingAccount = {
          '@type': 'Account',
          placeholder: false,
          service,
          identifier: ''
        }
      }

      if (isMobile()) {
        window.scrollTo(0, 0)
      }

      this.setState({
        accountEditIsOpen: true,
        editingAccount
      })
    }
  }

  onValueChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  onPostVerificationButtonClick = (event, service, identifier) => {
    const profileIndex = this.props.defaultIdentity
    const identity = this.props.localIdentities[profileIndex]

    const url = `${VERIFICATION_TWEET_LINK_URL_BASE}${identity.ownerAddress}`
    const verificationText = `Verifying my Blockstack ID is secured with the address ${
      identity.ownerAddress
    } ${url}`
    let verificationUrl = ''

    if (service === 'twitter') {
      verificationUrl = `https://twitter.com/intent/tweet?text=${verificationText}`
    } else if (service === 'facebook') {
      verificationUrl = `https://www.facebook.com/dialog/feed?app_id=258121411364320&link=${url}`
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

  onVerifyButtonClick = (service, identifier, proofUrl) => {
    const profile = { ...this.state.profile }

    if (!profile.hasOwnProperty('account')) {
      profile.account = []
    }

    if (profile.hasOwnProperty('account')) {
      let hasAccount = false
      profile.account.forEach(account => {
        if (account.service === service) {
          hasAccount = true
          account.identifier = identifier
          account.proofUrl = proofUrl
          if (this.shouldAutoGenerateProofUrl(service)) {
            account.proofUrl = this.generateProofUrl(service, identifier)
          }
          this.setState({ profile })
          this.saveProfile(profile)
          this.refreshProofs()
        }
      })

      if (!hasAccount && identifier.length > 0) {
        const newAccount = this.createNewAccount(service, identifier, proofUrl)
        if (this.shouldAutoGenerateProofUrl(service)) {
          newAccount.proofUrl = this.generateProofUrl(service, identifier)
        }
        profile.account.push(newAccount)
        this.setState({ profile })
        this.saveProfile(profile)
        this.refreshProofs()
      }

      if (hasAccount && identifier.length === 0) {
        this.removeAccount(service)
      }
    }

    this.closeSocialAccountModal()
  }

  onAccountDoneButtonClick = (service, identifier) => {
    const profile = { ...this.state.profile }

    if (!profile.hasOwnProperty('account')) {
      profile.account = []
    }

    if (profile.hasOwnProperty('account')) {
      let hasAccount = false
      profile.account.forEach(account => {
        if (account.service === service) {
          hasAccount = true
          account.identifier = identifier
          this.setState({ profile })
          this.saveProfile(profile)
          this.refreshProofs()
        }
      })

      if (!hasAccount && identifier.length > 0) {
        const newAccount = this.createNewAccount(service, identifier, '')
        profile.account.push(newAccount)
        this.setState({ profile })
        this.saveProfile(profile)
        this.refreshProofs()
      }

      if (hasAccount && identifier.length === 0) {
        this.removeAccount(service)
      }
    }

    this.closeAccountModal()
  }

  onMoreAccountsClick = () => {
    this.setState({
      showHiddenPlaceholders: true
    })
  }

  componentHasNewLocalIdentities(props) {
    logger.info('componentHasNewLocalIdentities')
    const identityIndex = this.props.defaultIdentity
    if (props.localIdentities[identityIndex]) {
      logger.info('componentHasNewLocalIdentities: identity found')
      const newProfile = props.localIdentities[identityIndex].profile
      const newUsername = props.localIdentities[identityIndex].username

      this.setState({
        profile: newProfile,
        username: newUsername
      })
    } else {
      logger.info('componentHasNewLocalIdentities: no identity found')
    }
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

  async saveProfile(newProfile) {
    logger.info('saveProfile')

    const identityIndex = this.props.defaultIdentity
    const identity = this.props.localIdentities[identityIndex]

    this.props.updateProfile(
      this.props.defaultIdentity,
      newProfile,
      identity.zoneFile
    )
    logger.info('saveProfile: Preparing to upload profile')
    logger.debug(`saveProfile: signing with key index ${identityIndex}`)

    const identitySigner = this.props.identityKeypairs[identityIndex]
    const signedProfileTokenData = await signProfileForUpload(
      newProfile,
      identitySigner
    )
    if (this.props.storageConnected) {
      await uploadProfile(
        this.props.api,
        identity,
        identitySigner,
        signedProfileTokenData
      ).catch(err => {
        logger.error('saveProfile: profile not uploaded', err)
      })
    } else {
      logger.debug('saveProfile: storage is not connected. Doing nothing.')
    }
  }

  refreshProofs() {
    const profile = this.state.profile
    const identityIndex = this.props.defaultIdentity
    const identity = this.props.localIdentities[identityIndex]
    const identityAddress = identity.ownerAddress
    const username = identity.username

    this.props.refreshSocialProofVerifications(
      identityIndex,
      identityAddress,
      username,
      profile
    )
  }

  openPhotoModal = (event) => {
    if (event) {
      event.preventDefault()
    }
    this.setState({
      photoModalIsOpen: true
    })
  }

  closePhotoModal = (event) => {
    if (event) {
      event.preventDefault()
    }
    this.setState({
      photoModalIsOpen: false
    })
  }

  onPhotoUpload = (url) => {
    const newProfile = {
      ...this.state.profile,
      image: [{
        '@type': 'ImageObject',
        name: 'avatar',
        contentUrl: url
      }]
    }

    this.setState({
      // Add some garbage for cache busting since the
      // photo may have the same URL as before
      avatarCacheBust: Math.random(),
      profile: newProfile
    })
    this.saveProfile(newProfile)
    this.closePhotoModal()
  }

  closeSocialAccountModal = () => {
    this.setState({
      socialAccountEditIsOpen: false
    })
  }

  closeAccountModal = () => {
    this.setState({
      accountEditIsOpen: false
    })
  }

  availableIdentityAddresses = () =>
    this.props.nextUnusedAddressIndex + 1 <=
    this.props.identityAddresses.length

  createNewAccount(service, identifier, proofUrl) {
    return {
      '@type': 'Account',
      placeholder: false,
      service,
      identifier,
      proofType: 'http',
      proofUrl
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

  removeAccount = service => {
    const profile = { ...this.state.profile }
    const accounts = profile.account

    if (accounts) {
      logger.info('Removing account')
      const newAccounts = accounts.filter(
        account => account.service !== service
      )
      profile.account = newAccounts
      this.setState({ profile })
      this.saveProfile(profile)
      this.refreshProofs()
    }
  }

  avatarUrlWithCacheBust = (avatarUrl, cacheBust) => {
    const urlParts = nodeUrl.parse(avatarUrl, true)
    const query = urlParts.query
    
    if(cacheBust.length === 0) {
      return avatarUrl
    }

    if (Object.keys(query).length > 0) {
      return `${avatarUrl}&${cacheBust}`
    } else {
      return `${avatarUrl}?${cacheBust}`
    }
  }

  render() {
    const identityIndex = this.props.defaultIdentity
    const identity = this.state.localIdentities[identityIndex]
    const profile = this.state.profile
    const person = new Person(profile)

    if (identity.username) {
      identity.canAddUsername = false
    } else {
      identity.canAddUsername = true
    }

    const ownerAddress = identity.ownerAddress
    const verifications = identity.verifications
    const trustLevel = identity.trustLevel
    // const blockNumber = identity.blockNumber
    // const transactionIndex = identity.transactionIndex
    const profileCompleteness = calculateProfileCompleteness(
      profile,
      verifications
    )

    const filledAccounts = []
    const placeholders = []
    let hiddenAccounts = hiddenAccountTypes

    if (profile.hasOwnProperty('account')) {
      accountTypes.forEach(accountType => {
        let hasAccount = false
        profile.account.forEach(account => {
          if (account.service === accountType) {
            hasAccount = true
            account.placeholder = false
            filledAccounts.push(account)
          }
        })

        const hideAccount = hiddenAccounts.indexOf(accountType) >= 0

        if (hasAccount && hideAccount) {
          hiddenAccounts = hiddenAccounts.filter(
            hiddenAccount => hiddenAccount !== accountType
          )
        }

        if (!hasAccount) {
          if (hideAccount) {
            if (this.state.showHiddenPlaceholders) {
              placeholders.push(this.createPlaceholderAccount(accountType))
            }
          } else {
            placeholders.push(this.createPlaceholderAccount(accountType))
          }
        }
      })
    } else {
      accountTypes.forEach(accountType => {
        const hideAccount = hiddenAccounts.indexOf(accountType) >= 0
        if (hideAccount) {
          if (this.state.showHiddenPlaceholders) {
            placeholders.push(this.createPlaceholderAccount(accountType))
          }
        } else {
          placeholders.push(this.createPlaceholderAccount(accountType))
        }
      })
    }

    // const accounts = person.profile().account || []
    function compareNames(a, b) { return a.service > b.service ? 1 : -1 }
    const accounts = filledAccounts.sort(compareNames).concat(placeholders.sort(compareNames))
    const showMoreAccountsButton = hiddenAccounts.length > 0
    // const connections = person.connections() || []

    const socialAccountEdit = () => {
      if (isMobile()) {
        return this.state.socialAccountEditIsOpen ? (
          <div>
            <SecondaryNavBar
              leftButtonTitle="Back"
              leftIsButton
              onLeftButtonClick={this.closeSocialAccountModal}
            />
            <div className="container-fluid m-t-10">
              <div className="row">
                <div className="col-12">
                  <div className="social-account-edit">
                    <EditSocialAccount
                      ownerAddress={ownerAddress}
                      service={this.state.editingSocialAccount.service}
                      identifier={this.state.editingSocialAccount.identifier}
                      proofUrl={this.state.editingSocialAccount.proofUrl}
                      onPostVerificationButtonClick={
                        this.onPostVerificationButtonClick
                      }
                      onVerifyButtonClick={this.onVerifyButtonClick}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div />
        )
      } else {
        return (
          <Modal
            isOpen={this.state.socialAccountEditIsOpen}
            contentLabel=""
            onRequestClose={this.closeSocialAccountModal}
            shouldCloseOnOverlayClick
            style={{ overlay: { zIndex: 10 } }}
            className="container-fluid social-account-modal"
          >
            <EditSocialAccount
              ownerAddress={ownerAddress}
              service={this.state.editingSocialAccount.service}
              identifier={this.state.editingSocialAccount.identifier}
              proofUrl={this.state.editingSocialAccount.proofUrl}
              onPostVerificationButtonClick={this.onPostVerificationButtonClick}
              onVerifyButtonClick={this.onVerifyButtonClick}
            />
          </Modal>
        )
      }
    }

    const accountEdit = () => {
      if (isMobile()) {
        return this.state.accountEditIsOpen ? (
          <div>
            <SecondaryNavBar
              leftButtonTitle="Back"
              leftIsButton
              onLeftButtonClick={this.closeAccountModal}
            />
            <div className="container-fluid m-t-10">
              <div className="row">
                <div className="col-12">
                  <div className="social-account-edit">
                    <EditAccount
                      ownerAddress={ownerAddress}
                      service={this.state.editingAccount.service}
                      identifier={this.state.editingAccount.identifier}
                      onDoneButtonClick={this.onAccountDoneButtonClick}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div />
        )
      } else {
        return (
          <Modal
            isOpen={this.state.accountEditIsOpen}
            contentLabel=""
            onRequestClose={this.closeAccountModal}
            shouldCloseOnOverlayClick
            style={{ overlay: { zIndex: 10 } }}
            className="container-fluid social-account-modal"
          >
            <EditAccount
              ownerAddress={ownerAddress}
              service={this.state.editingAccount.service}
              identifier={this.state.editingAccount.identifier}
              onDoneButtonClick={this.onAccountDoneButtonClick}
            />
          </Modal>
        )
      }
    }

    return (
      <div>
        <PhotoModal
          isOpen={this.state.photoModalIsOpen}
          handleClose={this.closePhotoModal}
          onUpload={this.onPhotoUpload}
        />

        {socialAccountEdit()}
        {accountEdit()}

        <ToolTip
          id="ownerAddress"
          offset={{
            bottom: '20',
            right: '120'
          }}
        >
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
            <div>
              Increase your social level by verifying your social accounts.
            </div>
          </div>
        </ToolTip>
        <div>
          {!(
            isMobile() &&
            (this.state.socialAccountEditIsOpen || this.state.accountEditIsOpen)
          ) && (
            <div>
              {profileCompleteness < 1 && (
                <ProfileCompletion completePct={profileCompleteness} />
              )}
              <div className="container-fluid m-t-50 p-0">
                <div className="row">
                  <div className="col-12">
                    <div className="avatar-md m-b-0 text-center">
                      {person.avatarUrl() ? (
                        <Image
                          src={this.avatarUrlWithCacheBust(person.avatarUrl(), this.state.avatarCacheBust)}
                          fallbackSrc={defaultAvatarImage}
                          className="rounded-circle clickable"
                          onClick={this.openPhotoModal}
                          style={{
                            width: '96px',
                            height: '96px'
                          }}
                        />
                      ) : (
                        <UserAvatar
                          id={identity.ownerAddress}
                          username={identity.username || '?'}
                          onClick={this.openPhotoModal}
                          size={96}
                          textSize={24}
                          camera
                          style={{ marginLeft: 'auto', marginRight: 'auto' }}
                        />
                      )}
                    </div>
                  </div>

                  {this.state.editMode ? (
                    <div className="col-12 m-t-30">
                      <InputGroup
                        name="name"
                        label="Full Name"
                        data={this.state}
                        onChange={this.onValueChange}
                        centerText
                      />
                      <InputGroup
                        name="description"
                        label="Short Bio"
                        textarea
                        data={this.state}
                        onChange={this.onValueChange}
                        centerText
                      />
                    </div>
                  ) : (
                    <div className="col-12">
                      <div className="text-center">
                        {/* {(blockNumber && transactionIndex) ?
                          <div className="idcard-body dim">
                            Registered in block <span>#{blockNumber}</span>,<br />
                            transaction <span>#{transactionIndex}</span>
                          </div>
                        : null}*/}
                        <div className="pro-card-name text-center m-t-30">
                          {person.name() && person.name().length > 0 ? (
                            person.name()
                          ) : (
                            <span className="placeholder">Add your name</span>
                          )}
                          <span className="pro-card-edit">
                            <i
                              className="fa fa-fw fa-pencil clickable"
                              onClick={this.onEditClick}
                            />
                          </span>
                        </div>

                        <div className="text-center">
                          {identity.canAddUsername ? (
                            <div className="text-center">
                              <Link
                                to={`/profiles/i/add-username/${identityIndex}/search`}
                                className="btn btn-outline-dark btn-pill btn-xs m-t-15 m-b-15"
                              >
                                Add a username
                              </Link>
                            </div>
                          ) : (
                            <div className="pro-card-domain-name text-center text-secondary m-t-0">
                              <span>{identity.username}</span>
                              {identity.usernamePending ? (
                                <i
                                  className="fa fa-fw fa-clock-o fa-lg"
                                  data-tip
                                  data-for="usernamePending"
                                />
                              ) : null}
                            </div>
                          )}
                        </div>

                        <div
                          className="pro-card-identity-address m-b-25 text-center
                          text-secondary m-t-0"
                        >
                          <small>
                            <span data-tip data-for="ownerAddress">
                              {`ID-${identity.ownerAddress}`}
                            </span>
                          </small>
                        </div>

                        <div className="pro-card-body text-center m-b-25">
                          {person.description() &&
                          person.description().length > 0 ? (
                            person.description()
                          ) : (
                            <span className="placeholder">Add your bio</span>
                          )}
                          <span className="pro-card-edit">
                            <i
                              className="fa fa-fw fa-pencil clickable"
                              onClick={this.onEditClick}
                            />
                          </span>
                        </div>

                        {/*
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
                    </div>
                  )}
                </div>
              </div>

              <div className="container-fluid p-0">
                <div className="row">
                  <div className="col-12">
                    <div className="container-fluid text-center m-t-25 m-b-40">
                      <span
                        className="btn btn-dark btn-pill btn-xs"
                        style={{ boxShadow: 'none' }}
                      >
                        {trustLevel >= 3 && (
                          <i className="fa fa-lg fa-check-circle" />
                        )}
                        <span className="pro-card-trust-level">
                          Social Level: {trustLevel}{' '}
                        </span>
                        {trustLevel <= 1 && (
                          <span data-tip data-for="trustLevel">
                            <i className="fa fa-info-circle" />
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="container-fluid p-0">
                <div className="d-flex justify-content-around m-t-10">
                  <button
                    className="btn btn-outline-dark btn-pill btn-sm ml-5"
                    title={this.state.editMode ? 'Save' : 'Edit'}
                    onClick={
                      this.state.editMode
                        ? this.onSaveClick
                        : this.onEditClick
                    }
                  >
                    {this.state.editMode ? 'Save' : 'Edit'}
                  </button>
                  {this.state.editMode ? (
                    <button
                      className="btn btn-outline-dark btn-pill btn-sm mr-5"
                      title="Cancel"
                      onClick={this.onCancelClick}
                    >
                      Cancel
                    </button>
                  ) : (
                    <Link
                      className="btn btn-outline-dark btn-pill btn-sm mr-5"
                      to="/profiles/i/all"
                    >
                      More
                    </Link>
                  )}
                </div>
              </div>

              <div className="container-fluid p-0">
                <div className="row m-t-50 no-gutters">
                  <div className="col">
                    <div className="profile-accounts">
                      <ul>
                        {accounts.map(account => {
                          let verified = false
                          let pending = false
                          if (verifications.length > 0) {
                            for (let i = 0; i < verifications.length; i++) {
                              const verification = verifications[i]
                              if (
                                verification.service === account.service &&
                                verification.valid === true
                              ) {
                                verified = true
                                pending = false
                                break
                              }
                            }
                          } else {
                            pending = true
                          }

                          if (
                            account.service === 'pgp' ||
                            account.service === 'ssh' ||
                            account.service === 'bitcoin' ||
                            account.service === 'ethereum'
                          ) {
                            return (
                              <PGPAccountItem
                                key={`${account.service}-${account.identifier}`}
                                editing={this.state.editMode}
                                service={account.service}
                                identifier={account.identifier}
                                contentUrl={account.contentUrl}
                                placeholder={account.placeholder}
                                onClick={this.onAccountClick}
                                listItem
                              />
                            )
                          } else {
                            return (
                              <SocialAccountItem
                                key={`${account.service}-${account.identifier}`}
                                editing={this.state.editMode}
                                service={account.service}
                                identifier={account.identifier}
                                proofUrl={account.proofUrl}
                                listItem
                                verified={verified}
                                placeholder={account.placeholder}
                                pending={pending}
                                onClick={this.onSocialAccountClick}
                              />
                            )
                          }
                        })}
                      </ul>
                      <div className="text-center">
                        {!this.state.showHiddenPlaceholders &&
                        showMoreAccountsButton ? (
                          <button
                            className="btn btn-link btn-link-mute btn-link-small"
                            onClick={this.onMoreAccountsClick}
                          >
                            More accounts
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DefaultProfilePage)
