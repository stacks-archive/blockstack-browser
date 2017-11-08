import React, { Component, PropTypes } from 'react'
import Modal from 'react-modal'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Alert from '../components/Alert'

import { AccountActions } from '../account/store/account'
import { IdentityActions } from '../profiles/store/identity'
import { SettingsActions } from '../account/store/settings'
import { redirectToConnectToDropbox } from '../account/utils/dropbox'
import { redirectToConnectToGaiaHub } from '../account/utils/blockstack-inc'
import { isWebAppBuild } from '../utils/window-utils'

import { PairBrowserView, LandingView,
  NewInternetView, RestoreView, DataControlView, EnterPasswordView,
  CreateIdentityView, WriteDownKeyView, ConfirmIdentityKeyView,
  EnterEmailView,
  ConnectStorageView } from './components'


import { decrypt, isBackupPhraseValid } from '../utils'


import log4js from 'log4js'

const logger = log4js.getLogger('welcome/WelcomeModal.js')

const START_PAGE_VIEW = 0
const WRITE_DOWN_IDENTITY_PAGE_VIEW = 6
const EMAIL_VIEW = 3
const STORAGE_PAGE_VIEW = 8

function mapStateToProps(state) {
  return {
    api: state.settings.api,
    promptedForEmail: state.account.promptedForEmail,
    encryptedBackupPhrase: state.account.encryptedBackupPhrase,
    identityAddresses: state.account.identityAccount.addresses,
    connectedStorageAtLeastOnce: state.account.connectedStorageAtLeastOnce,
    email: state.account.email
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({},
    AccountActions, SettingsActions, IdentityActions),
    dispatch)
}

class WelcomeModal extends Component {
  static propTypes = {
    accountCreated: PropTypes.bool.isRequired,
    storageConnected: PropTypes.bool.isRequired,
    coreConnected: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
    updateApi: PropTypes.func.isRequired,
    api: PropTypes.object.isRequired,
    promptedForEmail: PropTypes.bool.isRequired,
    encryptedBackupPhrase: PropTypes.string,
    initializeWallet: PropTypes.func.isRequired,
    emailNotifications: PropTypes.func.isRequired,
    skipEmailBackup: PropTypes.func.isRequired,
    identityAddresses: PropTypes.array,
    createNewIdentityWithOwnerAddress: PropTypes.func.isRequired,
    setDefaultIdentity: PropTypes.func.isRequired,
    connectedStorageAtLeastOnce: PropTypes.bool.isRequired,
    needToUpdate: PropTypes.bool.isRequired,
    router: PropTypes.object.isRequired,
    email: PropTypes.string
  }

  constructor(props) {
    super(props)
    const onboardingExceptStorageComplete = this.props.accountCreated &&
      this.props.coreConnected && this.props.promptedForEmail

    const displayStepAfterEmail = props.coreConnected
      && props.promptedForEmail && !props.accountCreated

    const storageConnectedDuringOnboarding = this.props.connectedStorageAtLeastOnce
    const needToOnboardStorage = !storageConnectedDuringOnboarding && !this.props.storageConnected
    const updateInProgress = window.location.pathname === '/update'
    const connectingGaia = window.location.pathname === '/account/storage' &&
                          window.location.hash === '#gaiahub'
    if (!updateInProgress && this.props.accountCreated && !onboardingExceptStorageComplete) {
      logger.error('User has refreshed browser mid onboarding.')
    }

    let startPageView = START_PAGE_VIEW

    if (displayStepAfterEmail) {
      startPageView = EMAIL_VIEW + 1
    } else if (onboardingExceptStorageComplete && needToOnboardStorage) {
      startPageView = STORAGE_PAGE_VIEW
    }

    this.state = {
      accountCreated: this.props.accountCreated,
      storageConnected: this.props.storageConnected,
      coreConnected: this.props.coreConnected,
      needToOnboardStorage,
      pageOneView: 'create',
      email: null,
      page: startPageView,
      password: null,
      identityKeyPhrase: null,
      alert: null,
      restored: false,
      needToUpdate: this.props.needToUpdate,
      updateInProgress,
      connectingGaia
    }

    this.showLandingView = this.showLandingView.bind(this)
    this.showNewInternetView = this.showNewInternetView.bind(this)
    this.showRestoreView = this.showRestoreView.bind(this)
    this.showNextView = this.showNextView.bind(this)
    this.showPreviousView = this.showPreviousView.bind(this)
    this.verifyPasswordAndCreateAccount = this.verifyPasswordAndCreateAccount.bind(this)
    this.confirmIdentityKeyPhrase = this.confirmIdentityKeyPhrase.bind(this)
    this.restoreAccount = this.restoreAccount.bind(this)
    this.updateAlert = this.updateAlert.bind(this)
    this.setPage = this.setPage.bind(this)
    this.isOpen = this.isOpen.bind(this)
    this.connectGaiaHub = this.connectGaiaHub.bind(this)

    if (!this.isOpen() && this.props.needToUpdate) {
      logger.debug('On-boarding is not open & we need to update state...')
      props.router.push('/update')
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      accountCreated: nextProps.accountCreated,
      storageConnected: nextProps.storageConnected,
      coreConnected: nextProps.coreConnected
    })

    // This is a workaround to cache email in
    // component state so that it can be used the second time
    // we call promptedForEmail
    if (nextProps.email) {
      this.setState({
        email: nextProps.email
      })
    }

    const storageConnectedDuringOnboarding = nextProps.connectedStorageAtLeastOnce
    const needToOnboardStorage = !storageConnectedDuringOnboarding && !nextProps.storageConnected

    const onboardingExceptStorageComplete = nextProps.accountCreated &&
      nextProps.coreConnected && nextProps.promptedForEmail

    const displayStepAfterEmail = nextProps.coreConnected
    && nextProps.promptedForEmail && !nextProps.accountCreated


    this.setState({
      needToOnboardStorage
    })

    if (displayStepAfterEmail && this.page !== EMAIL_VIEW) {
      logger.debug('componentWillReceiveProps: setting to view after email view')
      this.setPage(EMAIL_VIEW + 1)
    } else if (onboardingExceptStorageComplete && needToOnboardStorage) {
      logger.debug('componentWillReceiveProps: setting storage view')
      this.setPage(STORAGE_PAGE_VIEW)
    }

    const updateInProgress = window.location.pathname === '/update'
    this.setState({ updateInProgress })
    if (!updateInProgress && nextProps.accountCreated && !this.props.accountCreated) {
      logger.debug('account created - checking for valid password in component state')
      decrypt(new Buffer(this.props.encryptedBackupPhrase, 'hex'), this.state.password)
      .then((identityKeyPhraseBuffer) => {
        logger.debug('Backup phrase successfully decrypted. Storing keychain phrase.')
        this.setState({ identityKeyPhrase: identityKeyPhraseBuffer.toString() })

        const firstIdentityIndex = 0
        const ownerAddress = this.props.identityAddresses[firstIdentityIndex]

        // create first profile
        this.props.createNewIdentityWithOwnerAddress(firstIdentityIndex, ownerAddress)

        // Set as default profile
        this.props.setDefaultIdentity(firstIdentityIndex)
        if (this.state.restored) {
          logger.debug('componentWillReceiveProps: setting email view during restore')
          this.setPage(EMAIL_VIEW)
        } else {
          logger.debug('componentWillReceiveProps: setting write down phrase view')
          this.setPage(WRITE_DOWN_IDENTITY_PAGE_VIEW)
        }
      }, () => {
        logger.debug('User has refreshed browser mid onboarding.')

        this.setPage(START_PAGE_VIEW)
      })
    }
  }

  onValueChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  setPage(page) {
    this.setState({
      page,
      alert: null
    })
  }

  verifyPasswordAndCreateAccount(password, passwordConfirmation) {
    logger.trace('createAccount')
    return new Promise((resolve, reject) => {
      if (password !== passwordConfirmation) {
        logger.error('createAccount: password and confirmation do not match')
        this.updateAlert('danger',
        'The password confirmation does not match the password you entered.')
        reject()
      } else {
        this.setState({ password })
        logger.debug('Initializing account...')
        this.props.initializeWallet(password, null)
        resolve()
      }
    })
  }

  restoreAccount(identityKeyPhrase, password, passwordConfirmation) {
    logger.trace('restoreAccount')
    const { isValid } = isBackupPhraseValid(identityKeyPhrase)

    if (!isValid) {
      logger.error('restoreAccount: invalid keychain phrase entered')
      this.updateAlert('danger', 'The keychain phrase you entered is not valid.')
      return
    }

    if (password !== passwordConfirmation) {
      logger.error('restoreAccount: password and confirmation do not match')
      this.updateAlert('danger',
      'The password confirmation does not match the password you entered.')
      return
    }

    this.setState({
      identityKeyPhrase,
      password,
      restored: true
    })
    this.props.initializeWallet(password, identityKeyPhrase)
  }

  showLandingView(event) {
    event.preventDefault()
    this.setState({
      pageOneView: 'newInternet'
    })
    this.setPage(0)
  }

  showNewInternetView(event)  {
    event.preventDefault()
    this.setState({
      pageOneView: 'newInternet',
      page: 1
    })
  }

  showRestoreView(event)  {
    event.preventDefault()
    this.setState({
      pageOneView: 'restore',
      page: 1
    })
  }

  showNextView(event)  {
    logger.trace('showNextView')

    if (event) {
      event.preventDefault()
    }

    this.setPage(this.state.page + 1)
  }

  showPreviousView(event)  {
    logger.trace('showPreviousView')

    if (event) {
      event.preventDefault()
    }

    this.setPage(this.state.page - 1)
  }

  connectDropbox(event) {
    event.preventDefault()
    redirectToConnectToDropbox()
  }

  connectGaiaHub(event) {
    event.preventDefault()
    // need to call this again because state gets deleted before this
    this.props.emailNotifications(this.state.email, false)

    redirectToConnectToGaiaHub()
  }

  confirmIdentityKeyPhrase(enteredIdentityKeyPhrase) {
    if (this.state.identityKeyPhrase !== enteredIdentityKeyPhrase) {
      logger.error('confirmIdentityKeyPhrase: user entered keychain phrase does not match')
      this.updateAlert('danger',
    'The keychain phrase you entered does not match! Please make sure you wrote it down correctly.')
      return
    }
    logger.debug('confirmIdentityKeyPhrase: user entered keychain phrase matches!')
    this.showNextView()
  }

  updateAlert(alertStatus, alertMessage) {
    this.setState({
      alert: { status: alertStatus, message: alertMessage }
    })
  }

  isOpen() {
    const shouldBeOpen = !this.state.accountCreated ||
      !this.state.coreConnected || !this.props.promptedForEmail ||
      this.state.needToOnboardStorage
    return shouldBeOpen && (!this.state.updateInProgress && !this.state.connectingGaia)
  }

  render() {
    const isOpen = this.isOpen()

    const needToPair = !this.state.coreConnected

    const page =  this.state.page
    const pageOneView = this.state.pageOneView
    const alert = this.state.alert

    return (
      <div>
        <Modal
          isOpen={isOpen}
          onRequestClose={this.props.closeModal}
          contentLabel="Welcome Modal"
          shouldCloseOnOverlayClick={false}
          style={{ overlay: { zIndex: 10 } }}
          className="container-fluid"
          portalClassName="welcome-modal"
        >
          {needToPair ?
            <PairBrowserView />
          :
            <div>
              <div>
                {alert ?
                  <Alert key="1" message={alert.message} status={alert.status} />
                  :
                  null
                }
              </div>
              <div>
              {page === 0 ?
                <LandingView
                  showNewInternetView={this.showNewInternetView}
                  showRestoreView={this.showRestoreView}
                  webAppBuild={isWebAppBuild()}
                />
              : null}
              </div>
              <div>
                {
                  page === 1 ?
                    <div>
                    {
                        pageOneView === 'newInternet' ?
                          <NewInternetView
                            showNextView={this.showNextView}
                          />
                        :
                          <RestoreView
                            showLandingView={this.showLandingView}
                            restoreAccount={this.restoreAccount}
                          />
                    }
                    </div>
                  :
                  null
                }
              </div>
              <div>
              {
                page === 2 ?
                  <DataControlView
                    showNextView={this.showNextView}
                  />
                :
                null
              }
              </div>
              <div>
              {
                page === 4 ?
                  <CreateIdentityView
                    showNextView={this.showNextView}
                  />
                :
                null
              }
              </div>
              <div>
              {
                page === 5 ?
                  <EnterPasswordView
                    verifyPasswordAndCreateAccount={this.verifyPasswordAndCreateAccount}
                  />
                :
                null
              }
              </div>
              <div>
              {
                page === 6 ?
                  <WriteDownKeyView
                    identityKeyPhrase={this.state.identityKeyPhrase}
                    showNextView={this.showNextView}
                    showPreviousView={this.showPreviousView}
                    webAppBuild={isWebAppBuild()}
                  />
                :
                null
              }
              </div>
              <div>
              {
                page === 7 ?
                  <ConfirmIdentityKeyView
                    confirmIdentityKeyPhrase={this.confirmIdentityKeyPhrase}
                    showPreviousView={this.showPreviousView}
                  />
                :
                null
              }
              </div>
              <div>
              {
                page === 3 ?
                  <EnterEmailView />
                :
                null
              }
              </div>
              <div>
              {
                page === 8 ?
                  <ConnectStorageView
                    connectGaiaHub={this.connectGaiaHub}
                    connectDropbox={this.connectDropbox}
                  />
                :
                null
              }
              </div>
            </div>
          }
        </Modal>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WelcomeModal)
