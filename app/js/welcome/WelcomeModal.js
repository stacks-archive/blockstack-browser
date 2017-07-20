import React, { Component, PropTypes } from 'react'
import Modal from 'react-modal'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { AccountActions } from '../account/store/account'
import { SettingsActions } from '../account/store/settings'

import { PairBrowserView, LandingView,
  NewInternetView, RestoreView, DataControlView,
  CreateIdentityView, WriteDownKeyView, ConfirmIdentityKeyView,
  EnterEmailView } from './components'

import log4js from 'log4js'

const logger = log4js.getLogger('welcome/WelcomeModal.js')

const CREATE_IDENTITY_PAGE_VIEW = 4

const TESTING_IDENTITY_KEY =
'biology amazing joke rib defy emotion fruit ecology blanket absent ivory bird'

function mapStateToProps(state) {
  return {
    api: state.settings.api,
    promptedForEmail: state.account.promptedForEmail,
    encryptedBackupPhrase: state.account.encryptedBackupPhrase
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, AccountActions, SettingsActions), dispatch)
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
    initializeWallet: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    let startingPage = 0
    if (this.props.accountCreated) {
      startingPage = CREATE_IDENTITY_PAGE_VIEW
    }
    this.state = {
      accountCreated: this.props.accountCreated,
      storageConnected: this.props.storageConnected,
      coreConnected: this.props.coreConnected,
      pageOneView: 'create',
      email: '',
      page: startingPage,
      password: null,
      identityKeyPhrase: null
    }

    this.showLandingView = this.showLandingView.bind(this)
    this.showNewInternetView = this.showNewInternetView.bind(this)
    this.showRestoreView = this.showRestoreView.bind(this)
    this.showNextView = this.showNextView.bind(this)
    this.createAccount = this.createAccount.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      accountCreated: nextProps.accountCreated,
      storageConnected: nextProps.storageConnected,
      coreConnected: nextProps.coreConnected
    })

    if (nextProps.accountCreated && !this.props.accountCreated) {
      this.setState({
        page: CREATE_IDENTITY_PAGE_VIEW
      })
    }
  }

  onValueChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  createAccount(password) {
    console.log(password)
    logger.trace('createAccount')
    this.setState({ password })
    this.props.initializeWallet(password, null)
  }

  showLandingView(event) {
    event.preventDefault()
    this.setState({
      pageOneView: 'newInternet',
      page: 0
    })
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
    if (event) {
      event.preventDefault()
    }

    this.setState({
      page: this.state.page + 1
    })
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
      alerts: [{ status: alertStatus, message: alertMessage }]
    })
  }

  render() {
    const isOpen = !this.state.accountCreated ||
      !this.state.coreConnected || !this.props.promptedForEmail

    const needToPair = !this.state.coreConnected

    const page =  this.state.page
    const pageOneView = this.state.pageOneView

    return (
      <div className="">
        <Modal
          isOpen={isOpen}
          onRequestClose={this.props.closeModal}
          contentLabel="Welcome Modal"
          shouldCloseOnOverlayClick={false}
          style={{ overlay: { zIndex: 10 } }}
          className="container-fluid"
        >
          {needToPair ?
            <PairBrowserView />
          :
            <div>
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
                  <EnterPasswordView
                    createAccount={this.createAccount}
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
                  <WriteDownKeyView
                    identityKeyPhrase={TESTING_IDENTITY_KEY} // TODO: replace w/ real key
                    showNextView={this.showNextView}
                  />
                :
                null
              }
              </div>
              <div>
              {
                page === 6 ?
                  <ConfirmIdentityKeyView
                    identityKeyPhrase={TESTING_IDENTITY_KEY}
                    showNextView={this.showNextView}
                  />
                :
                null
              }
              </div>
              <div>
              {
                page === 7 ?
                  <EnterEmailView
                    skipEmailBackup={this.props.skipEmailBackup}
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
