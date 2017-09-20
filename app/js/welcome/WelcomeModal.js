import React, { Component, PropTypes } from 'react'
import Modal from 'react-modal'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Alert from '../components/Alert'

import { AccountActions } from '../account/store/account'
import { IdentityActions } from '../profiles/store/identity'
import { SettingsActions } from '../account/store/settings'
import { redirectToConnectToDropbox } from '../account/utils/dropbox'


import { PairBrowserView, LandingView,
  NewInternetView, RestoreView, DataControlView, EnterPasswordView,
  CreateIdentityView, WriteDownKeyView, ConfirmIdentityKeyView,
  EnterEmailView,
  ConnectStorageView } from './components'


import { decrypt, isBackupPhraseValid } from '../utils'


import log4js from 'log4js'

const logger = log4js.getLogger('welcome/WelcomeModal.js')

const START_PAGE_VIEW = 0
const WRITE_DOWN_IDENTITY_PAGE_VIEW = 5
const EMAIL_VIEW = 7
const STORAGE_PAGE_VIEW = 8

function mapStateToProps(state) {
  return {
    api: state.settings.api,
    promptedForEmail: state.account.promptedForEmail,
    encryptedBackupPhrase: state.account.encryptedBackupPhrase,
    identityAddresses: state.account.identityAccount.addresses,
    connectedStorageAtLeastOnce: state.account.connectedStorageAtLeastOnce
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
    emailKeychainBackup: PropTypes.func.isRequired,
    promptedForEmail: PropTypes.bool.isRequired,
    encryptedBackupPhrase: PropTypes.string,
    initializeWallet: PropTypes.func.isRequired,
    emailNotifications: PropTypes.func.isRequired,
    skipEmailBackup: PropTypes.func.isRequired,
    identityAddresses: PropTypes.array,
    createNewIdentityFromDomain: PropTypes.func.isRequired,
    setDefaultIdentity: PropTypes.func.isRequired,
    connectedStorageAtLeastOnce: PropTypes.bool.isRequired
  }

  constructor(props) {
    super(props)

    const onboardingExceptStorageComplete = this.props.accountCreated &&
      this.props.coreConnected && this.props.promptedForEmail


    const storageConnectedDuringOnboarding = this.props.connectedStorageAtLeastOnce
    const needToOnboardStorage = !storageConnectedDuringOnboarding && !this.props.storageConnected

    if (this.props.accountCreated && !onboardingExceptStorageComplete) {
      logger.error('User has refreshed browser mid onboarding.')
    }

    let startPageView = START_PAGE_VIEW

    if (onboardingExceptStorageComplete && needToOnboardStorage) {
      startPageView = STORAGE_PAGE_VIEW
    }

    this.state = {
      accountCreated: this.props.accountCreated,
      storageConnected: this.props.storageConnected,
      coreConnected: this.props.coreConnected,
      needToOnboardStorage,
      pageOneView: 'create',
      email: '',
      page: startPageView,
      password: null,
      identityKeyPhrase: null,
      alert: null,
      restored: false
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
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      accountCreated: nextProps.accountCreated,
      storageConnected: nextProps.storageConnected,
      coreConnected: nextProps.coreConnected
    })

    const storageConnectedDuringOnboarding = nextProps.connectedStorageAtLeastOnce
    const needToOnboardStorage = !storageConnectedDuringOnboarding && !nextProps.storageConnected

    const onboardingExceptStorageComplete = nextProps.accountCreated &&
      nextProps.coreConnected && nextProps.promptedForEmail

    this.setState({
      needToOnboardStorage
    })

    if (onboardingExceptStorageComplete && needToOnboardStorage) {
      this.setPage(STORAGE_PAGE_VIEW)
    }

    if (nextProps.accountCreated && !this.props.accountCreated) {
      logger.debug('account created - checking for valid password in component state')
      decrypt(new Buffer(this.props.encryptedBackupPhrase, 'hex'), this.state.password)
      .then((identityKeyPhraseBuffer) => {
        logger.debug('Backup phrase successfully decrypted. Storing identity key.')
        this.setState({ identityKeyPhrase: identityKeyPhraseBuffer.toString() })

        const ownerAddress = this.props.identityAddresses[0]

        // create first profile
        this.props.createNewIdentityFromDomain(ownerAddress, ownerAddress)

        // Set as default profile
        this.props.setDefaultIdentity(ownerAddress)
        if (this.state.restored) {
          this.setPage(EMAIL_VIEW)
        } else {
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
        this.props.
        resolve()
      }
    })
  }

  restoreAccount(identityKeyPhrase, password, passwordConfirmation) {
    logger.trace('restoreAccount')
    const { isValid } = isBackupPhraseValid(identityKeyPhrase)

    if (!isValid) {
      logger.error('restoreAccount: invalid backup phrase entered')
      this.updateAlert('danger', 'The identity key you entered is not valid.')
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

  confirmIdentityKeyPhrase(enteredIdentityKeyPhrase) {
    if (this.state.identityKeyPhrase !== enteredIdentityKeyPhrase) {
      logger.error('confirmIdentityKeyPhrase: user entered identity phrase does not match')
      this.updateAlert('danger',
      'The identity key you entered does not match! Please make sure you wrote it down correctly.')
      return
    }
    logger.debug('confirmIdentityKeyPhrase: user entered identity phrase matches!')
    this.showNextView()
  }

  emailKeychainBackup(event) {
    event.preventDefault()
    this.props.emailKeychainBackup(this.state.email, this.props.encryptedBackupPhrase)
    return false
  }

  skipEmailBackup(event) {
    event.preventDefault()
    this.props.skipEmailBackup()
  }

  updateAlert(alertStatus, alertMessage) {
    this.setState({
      alert: { status: alertStatus, message: alertMessage }
    })
  }

  render() {

    const isOpen = !this.state.accountCreated ||
      !this.state.coreConnected || !this.props.promptedForEmail ||
      this.state.needToOnboardStorage


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
                page === 3 ?
                  <CreateIdentityView
                    showNextView={this.showNextView}
                  />
                :
                null
              }
              </div>
              <div>
              {
                page === 4 ?
                  <EnterPasswordView
                    verifyPasswordAndCreateAccount={this.verifyPasswordAndCreateAccount}
                  />
                :
                null
              }
              </div>
              <div>
              {
                page === 5 ?
                  <WriteDownKeyView
                    identityKeyPhrase={this.state.identityKeyPhrase}
                    showNextView={this.showNextView}
                    showPreviousView={this.showPreviousView}
                  />
                :
                null
              }
              </div>
              <div>
              {
                page === 6 ?
                  <ConfirmIdentityKeyView
                    identityKeyPhrase={this.state.identityKeyPhrase}
                    confirmIdentityKeyPhrase={this.confirmIdentityKeyPhrase}
                    showPreviousView={this.showPreviousView}
                  />
                :
                null
              }
              </div>
              <div>
              {
                page === 7 ?
                  <EnterEmailView
                    emailNotifications={this.props.emailNotifications}
                    skipEmailBackup={this.props.skipEmailBackup}
                  />
                :
                null
              }
              </div>
              <div>
              {
                page === 8 ?
                  <ConnectStorageView
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
