import React from 'react'
import PropTypes from 'prop-types'
import { decrypt, isBackupPhraseValid } from '@utils'
import { browserHistory, withRouter } from 'react-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { AccountActions } from '../account/store/account'
import { IdentityActions } from '../profiles/store/identity'
import { SettingsActions } from '../account/store/settings'

import { RegistrationActions } from '../profiles/store/registration'
import { Initial } from './views'
import { ShellParent, AppHomeWrapper } from '@blockstack/ui'
import {
  selectConnectedStorageAtLeastOnce,
  selectEmail,
  selectEncryptedBackupPhrase,
  selectIdentityAddresses,
  selectIdentityKeypairs,
  selectPromptedForEmail
} from '@common/store/selectors/account'
import {
  selectLocalIdentities,
  selectRegistration,
  selectDefaultIdentity
} from '@common/store/selectors/profiles'
import {
  selectApi,
  selectStorageConnected
} from '@common/store/selectors/settings'
import {
  selectAppManifest,
  selectAuthRequest
} from '@common/store/selectors/auth'
import { formatAppManifest } from '@common'

const VIEWS = {
  INITIAL: 0,
  PASSWORD: 1,
  SUCCESS: 2
}

const views = [Initial]

function mapStateToProps(state) {
  return {
    updateApi: PropTypes.func.isRequired,
    api: selectApi(state),
    appManifest: selectAppManifest(state),
    authRequest: selectAuthRequest(state),
    promptedForEmail: selectPromptedForEmail(state),
    encryptedBackupPhrase: selectEncryptedBackupPhrase(state),
    localIdentities: selectLocalIdentities(state),
    identityAddresses: selectIdentityAddresses(state),
    identityKeypairs: selectIdentityKeypairs(state),
    connectedStorageAtLeastOnce: selectConnectedStorageAtLeastOnce(state),
    storageConnected: selectStorageConnected(state),
    email: selectEmail(state),
    registration: selectRegistration(state),
    defaultIdentityIndex: selectDefaultIdentity(state)
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    Object.assign(
      {},
      AccountActions,
      SettingsActions,
      IdentityActions,
      RegistrationActions
    ),
    dispatch
  )
}

class SignIn extends React.Component {
  state = {
    view: 0
  }

  componentWillMount() {}

  render() {
    const { view } = this.state

    const viewProps = [
      {
        show: VIEWS.INITIAL,
        props: {
          previous: this.backToSignUp,
          next: this.validateRecoveryKey,
          updateValue: this.updateValue
        }
      },
      {
        show: VIEWS.PASSWORD,
        props: {
          previous: () => this.updateView(VIEWS.INITIAL),
          next: this.decryptKeyAndRestore,
          updateValue: this.updateValue
        }
      }
    ]

    const currentViewProps = viewProps.find(v => v.show === view) || {}

    const componentProps = {
      view,
      backView: () => this.backView(),
      decrypt: this.state.decrypt,
      loading: this.state.loading,
      decrypting: this.state.decrypting,
      password: this.state.password,
      error: this.state.restoreError,
      key: this.state.key || this.state.decryptedKey,
      ...currentViewProps.props
    }
    return (
      <React.Fragment>
        <ShellParent
          app={formatAppManifest(this.props.appManifest)}
          views={views}
          {...componentProps}
          headerLabel="Finish updating Blockstack"
          lastHeaderLabel="Welcome Back"
          invertOnLast
        />
        <AppHomeWrapper />
      </React.Fragment>
    )
  }
}

SignIn.propTypes = {
  api: PropTypes.object.isRequired,
  location: PropTypes.object,
  appManifest: PropTypes.object,
  authRequest: PropTypes.string,
  router: PropTypes.object,
  identityAddresses: PropTypes.array,
  createNewIdentityWithOwnerAddress: PropTypes.func.isRequired,
  setDefaultIdentity: PropTypes.func.isRequired,
  initializeWallet: PropTypes.func.isRequired,
  updateApi: PropTypes.func.isRequired,
  localIdentities: PropTypes.array.isRequired,
  identityKeypairs: PropTypes.array.isRequired,
  storageIsConnected: PropTypes.func.isRequired,
  encryptedBackupPhrase: PropTypes.string
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SignIn))
