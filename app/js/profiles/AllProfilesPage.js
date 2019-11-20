import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { config, Person } from 'blockstack'
import Modal from 'react-modal'
import SecondaryNavBar from '@components/SecondaryNavBar'
import Alert from '@components/Alert'
import IdentityItem from './components/IdentityItem'
import InputGroup from '@components/InputGroup'
import { IdentityActions } from './store/identity'
import { AccountActions } from '../account/store/account'

import log4js from 'log4js'

const logger = log4js.getLogger(__filename)

function mapStateToProps(state) {
  return {
    localIdentities: state.profiles.identity.localIdentities,
    defaultIdentity: state.profiles.identity.default,
    createProfileError: state.profiles.identity.createProfileError,
    isProcessing: state.profiles.identity.isProcessing,
    identityAddresses: state.account.identityAccount.addresses,
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

class AllProfilesPage extends Component {
  static propTypes = {
    localIdentities: PropTypes.array.isRequired,
    defaultIdentity: PropTypes.number.isRequired,
    createNewProfile: PropTypes.func.isRequired,
    refreshIdentities: PropTypes.func.isRequired,
    api: PropTypes.object.isRequired,
    identityAddresses: PropTypes.array.isRequired,
    nextUnusedAddressIndex: PropTypes.number.isRequired,
    encryptedBackupPhrase: PropTypes.string.isRequired,
    setDefaultIdentity: PropTypes.func.isRequired,
    resetCreateNewProfileError: PropTypes.func.isRequired,
    createProfileError: PropTypes.string,
    router: PropTypes.object.isRequired,
    isProcessing: PropTypes.bool
  }

  constructor(props) {
    super(props)
    this.state = {
      localIdentities: this.props.localIdentities,
      passwordPromptIsOpen: false,
      password: ''
    }
  }

  componentWillMount() {
    logger.info('componentWillMount')
    this.props.refreshIdentities(this.props.api, this.props.identityAddresses)
    config.network.getBlockHeight().then(currentBlockHeight => {
      this.setState({ currentBlockHeight })
    })
  }

  componentWillReceiveProps(nextProps) {
    logger.info('componentWillReceiveProps')
    this.setState({
      localIdentities: nextProps.localIdentities
    })

    const currentIdentityCount = Object.keys(this.props.localIdentities).length

    const newIdentityCount = Object.keys(nextProps.localIdentities).length
    if (currentIdentityCount < newIdentityCount) {
      this.setState({
        password: ''
      })
      this.closePasswordPrompt()
    }
  }

  onValueChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  setDefaultIdentity = index => {
    this.props.setDefaultIdentity(index)
  }

  createNewProfile = event => {
    logger.info('createNewProfile')
    event.preventDefault()

    if (!this.props.isProcessing) {
      const encryptedBackupPhrase = this.props.encryptedBackupPhrase
      const password = this.state.password
      const nextUnusedAddressIndex = this.props.nextUnusedAddressIndex

      this.props.createNewProfile(
        encryptedBackupPhrase,
        password,
        nextUnusedAddressIndex
      )
    }
  }

  openPasswordPrompt = event => {
    event.preventDefault()
    this.props.resetCreateNewProfileError()
    this.setState({
      passwordPromptIsOpen: true
    })
  }

  closePasswordPrompt = event => {
    if (event) {
      event.preventDefault()
    }
    this.setState({
      passwordPromptIsOpen: false
    })
  }

  availableIdentityAddresses = () =>
    this.props.nextUnusedAddressIndex + 1 <= this.props.identityAddresses.length

  render() {
    const createProfileError = this.props.createProfileError
    const passwordPromptIsOpen = this.state.passwordPromptIsOpen
    const gaiaBucketAddress = this.props.identityAddresses[0]
    const profileUrlBase = `https://gaia.blockstack.org/hub/${gaiaBucketAddress}`

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
            <h3 className="modal-heading">
              Enter your password to add another Blockstack ID
            </h3>
            <div>
              {createProfileError ? (
                <Alert
                  key="1"
                  message="Incorrect password"
                  status="danger"
                />
              ) : null}
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
              className="btn btn-primary btn-block"
              type="submit"
              disabled={this.props.isProcessing}
            >
              {this.props.isProcessing ? (
                <span>Processing...</span>
              ) : (
                <span>Add another ID</span>
              )}
            </button>
          </form>
        </Modal>
        <SecondaryNavBar
          leftButtonTitle="Back"
          leftButtonLink="/profiles"
        />
        <div className="m-t-40">
          <div className="container-fluid">
            <ul className="card-wrapper">
              {this.state.localIdentities.map((identity, index) => {
                const person = new Person(identity.profile)

                if (identity.username) {
                  identity.canAddUsername = false
                } else {
                  identity.canAddUsername = true
                }
                return (
                  <IdentityItem
                    key={index}
                    index={index}
                    username={identity.username}
                    pending={identity.usernamePending}
                    avatarUrl={person.avatarUrl() || ''}
                    onClick={event => {
                      event.preventDefault()
                      this.setDefaultIdentity(index)
                    }}
                    ownerAddress={identity.ownerAddress}
                    canAddUsername={identity.canAddUsername}
                    expireBlock={identity.expireBlock}
                    isDefault={index === this.props.defaultIdentity}
                    router={this.props.router}
                    profileUrl={`${profileUrlBase}/${index}/profile.json`}
                    currentBlockHeight={this.state.currentBlockHeight}
                  />
                )
              })}
            </ul>
          </div>
          <div className="container-fluid">
            <div className="row m-t-40">
              <div className="col">
                <button
                  className="btn btn-primary"
                  onClick={this.openPasswordPrompt}
                >
                  Add another ID
                </button>
              </div>
            </div>
            <div className="row m-t-20">
              <p className="col form-text text-muted">
                Are you missing IDs after restoring the browser? Use
                {' '}<em>Add another ID</em>{' '}
                for each ID you want to add back.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AllProfilesPage)
