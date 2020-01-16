import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Modal from 'react-modal'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Alert from './components/Alert'
import InputGroup from './components/InputGroup'
import { AccountActions } from './account/store/account'
import { IdentityActions } from './profiles/store/identity'
import { decrypt } from './utils'
import {
  CURRENT_VERSION,
  updateState,
  migrateAPIEndpoints
} from './store/reducers'
import { BLOCKSTACK_STATE_VERSION_KEY } from './App'
import { isWebAppBuild } from './utils/window-utils'
import {
  hasLegacyCoreStateVersion,
  migrateLegacyCoreEndpoints
} from './utils/api-utils'
import log4js from 'log4js'

const logger = log4js.getLogger(__filename)

function mapStateToProps(state) {
  return {
    api: state.settings.api,
    encryptedBackupPhrase: state.account.encryptedBackupPhrase,
    localIdentities: state.profiles.identity.localIdentities,
    defaultIdentity: state.profiles.identity.default,
    accountCreated: state.account.accountCreated,
    identityAddresses: state.account.identityAccount.addresses
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    Object.assign({}, AccountActions, IdentityActions, {
      updateState,
      migrateAPIEndpoints
    }),
    dispatch
  )
}

class UpdateStatePage extends Component {
  static propTypes = {
    router: PropTypes.object.isRequired,
    api: PropTypes.object,
    encryptedBackupPhrase: PropTypes.string,
    localIdentities: PropTypes.array,
    defaultIdentity: PropTypes.number,
    accountCreated: PropTypes.bool,
    initializeWallet: PropTypes.func.isRequired,
    identityAddresses: PropTypes.array,
    createNewIdentityWithOwnerAddress: PropTypes.func.isRequired,
    setDefaultIdentity: PropTypes.func.isRequired,
    updateState: PropTypes.func.isRequired,
    migrateAPIEndpoints: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      api: this.props.api,
      alert: null,
      password: '',
      upgradeInProgress: false
    }

    this.onValueChange = this.onValueChange.bind(this)
    this.upgradeBlockstackState = this.upgradeBlockstackState.bind(this)
    this.updateAlert = this.updateAlert.bind(this)
  }

  componentDidMount() {
    logger.info('componentDidMount')
  }

  componentWillReceiveProps(nextProps) {
    logger.info('componentWillReceiveProps')
    const upgradeInProgress = this.state.upgradeInProgress
    const accountCreated = this.props.accountCreated
    const nextAccountCreated = nextProps.accountCreated
    const nextIdentityAddresses = nextProps.identityAddresses

    if (upgradeInProgress && !nextAccountCreated) {
      const backupPhrase = this.state.backupPhrase
      logger.debug(
        'componentWillReceiveProps: state cleared. initializing wallet...'
      )
      this.props.initializeWallet(
        this.state.password,
        backupPhrase,
        this.state.numberOfIdentities
      )
    }

    if (
      upgradeInProgress &&
      !accountCreated &&
      nextAccountCreated &&
      nextIdentityAddresses
    ) {
      logger.debug(
        'componentWillReceiveProps: new account created - time to migrate data'
      )
      const numberOfIdentities = this.state.numberOfIdentities

      for (let i = 0; i < numberOfIdentities; i++) {
        logger.debug(`componentWillReceiveProps: identity index: ${i}`)
        const ownerAddress = nextProps.identityAddresses[i]
        nextProps.createNewIdentityWithOwnerAddress(i, ownerAddress)
      }
      logger.debug(
        `componentWillReceiveProps: Setting new state version to ${CURRENT_VERSION}`
      )
      localStorage.setItem(BLOCKSTACK_STATE_VERSION_KEY, CURRENT_VERSION)

      nextProps.setDefaultIdentity(this.state.defaultIdentity)
      nextProps.router.push('/')
    }
  }

  onValueChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  updateAlert(alertStatus, alertMessage) {
    this.setState({
      alert: { status: alertStatus, message: alertMessage }
    })
  }



    upgradeBlockstackState(event) {
    logger.info('upgradeBlockstackState')
    event.preventDefault()
    this.setState({ upgradeInProgress: true })
    //
    // number of identities to generate
    // default identity
    // copy api settings

    const { encryptedBackupPhrase } = this.props

    const dataBuffer = Buffer.from(encryptedBackupPhrase, 'hex')
    const password = this.state.password

    decrypt(dataBuffer, password)
      .then(backupPhraseBuffer => {
        const backupPhrase = backupPhraseBuffer.toString()
        logger.debug('upgradeBlockstackState: correct password!')
        const numberOfIdentities = this.props.localIdentities.length
        this.setState({
          correctPassword: password,
          encryptedBackupPhrase,
          backupPhrase,
          defaultIdentity: this.props.defaultIdentity,
          numberOfIdentities
        })
        if (hasLegacyCoreStateVersion()) {
          const migratedApi = migrateLegacyCoreEndpoints(this.props.api)
          this.props.migrateAPIEndpoints(migratedApi)
        }

        this.props.updateState()
      })
      .catch(error => {
        logger.error('upgradeBlockstackState: invalid password', error)
        this.updateAlert('danger', 'Wrong password')
        this.setState({ upgradeInProgress: false })
      })
  }

  render() {
    const alert = this.state.alert
    const isWebApp = isWebAppBuild()
    return (
      <Modal
        isOpen
        contentLabel="Add Username Modal"
        onRequestClose={this.closeModal}
        shouldCloseOnOverlayClick
        className="container-fluid"
        portalClassName="add-user-modal"
      >
        <div>
          {alert ? (
            <Alert key="1" message={alert.message} status={alert.status} />
          ) : null}
          <div>
            {isWebApp ? (
              <div>
                <h3 className="modal-heading">
                  We updated the Blockstack Browser
                </h3>
                <p>
                  Please enter your password to complete the update process.
                </p>
              </div>
            ) : (
              <div>
                <h3 className="modal-heading">Finish updating Blockstack</h3>
                <p>Enter your password to finish updating Blockstack.</p>
              </div>
            )}
          </div>
          <form className="modal-form" onSubmit={this.upgradeBlockstackState}>
            <InputGroup
              name="password"
              type="password"
              label="Password"
              placeholder="Password"
              data={this.state}
              onChange={this.onValueChange}
              required
            />
            <div className="m-t-25 m-b-30">
              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={this.state.upgradeInProgress}
              >
                {this.state.upgradeInProgress ? (
                  <span>Upgrading...</span>
                ) : (
                  <span>Finish</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UpdateStatePage)
