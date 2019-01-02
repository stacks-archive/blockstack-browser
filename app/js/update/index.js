import React from 'react'
import PropTypes from 'prop-types'
import { withRouter, browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { AccountActions } from '../account/store/account'
import { IdentityActions } from '../profiles/store/identity'
import { Initial, Success, NoUpdate } from './views'
import { AppHomeWrapper, ShellParent } from '@blockstack/ui'
import {
  selectAccountCreated,
  selectEncryptedBackupPhrase,
  selectIdentityAddresses
} from '@common/store/selectors/account'
import {
  selectDefaultIdentity,
  selectLocalIdentities
} from '@common/store/selectors/profiles'
import { selectApi } from '@common/store/selectors/settings'
import {
  CURRENT_VERSION,
  migrateAPIEndpoints,
  updateState
} from '../store/reducers'
import { formatAppManifest } from '@common'
import { BLOCKSTACK_STATE_VERSION_KEY } from '../App'
import {
  hasLegacyCoreStateVersion,
  migrateLegacyCoreEndpoints
} from '@utils/api-utils'
import { decrypt } from '@utils'
const VIEWS = {
  INITIAL: 0,
  SUCCESS: 1,
  NOUPDATE: 2
}

const views = [Initial, Success, NoUpdate]

const mapStateToProps = state => ({
  api: selectApi(state),
  encryptedBackupPhrase: selectEncryptedBackupPhrase(state),
  localIdentities: selectLocalIdentities(state),
  defaultIdentityIndex: selectDefaultIdentity(state),
  accountCreated: selectAccountCreated(state),
  identityAddresses: selectIdentityAddresses(state)
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      ...AccountActions,
      ...IdentityActions,
      updateState,
      migrateAPIEndpoints
    },
    dispatch
  )

class UpdatePage extends React.Component {
  static propTypes = {
    router: PropTypes.object.isRequired,
    api: PropTypes.object,
    encryptedBackupPhrase: PropTypes.string,
    localIdentities: PropTypes.array,
    defaultIdentityIndex: PropTypes.number,
    accountCreated: PropTypes.bool,
    initializeWallet: PropTypes.func.isRequired,
    identityAddresses: PropTypes.array,
    createNewIdentityWithOwnerAddress: PropTypes.func.isRequired,
    setDefaultIdentity: PropTypes.func.isRequired,
    updateState: PropTypes.func.isRequired,
    migrateAPIEndpoints: PropTypes.func.isRequired,
    updateValue: PropTypes.func,
    next: PropTypes.func,
    loading: PropTypes.bool,
    password: PropTypes.string,
    decrypt: PropTypes.bool,
    decrypting: PropTypes.bool,
    error: PropTypes.any,
    key: PropTypes.any
  }
  state = {
    status: 'initial',
    api: this.props.api,
    alert: null,
    password: '',
    loading: false,
    upgradeInProgress: false,
    generatedIDs: null,
    idsToGenerate: null,
    accountCreated: false,
    view: 0
  }

  componentWillMount() {
    /**
     * This will check versions and display the no update view if the user is on the latest version
     */
    if (
      JSON.parse(localStorage.getItem(BLOCKSTACK_STATE_VERSION_KEY)) ===
      CURRENT_VERSION
    ) {
      this.setState({
        view: VIEWS.NOUPDATE
      })
    }

    if (!this.props.encryptedBackupPhrase) {
      this.updateStateVersionAndResetOldPersistedData()
      this.props.router.push('/sign-up')
    }
  }

  /**
   * Decrypt key and reset our redux store
   *
   * This runs before createAccount
   * it will check and confirm the password is correct
   * and then update the state with some props from the current account
   * and then run createAccount
   */
  decryptKeyAndResetState = async () => {
    console.log('decryptKeyAndResetState')

    const {
      encryptedBackupPhrase,
      localIdentities,
      defaultIdentityIndex,
      api
    } = this.props

    if (!encryptedBackupPhrase) {
      console.error('No encryptedBackupPhrase, cannot continue')
      return null
    }
    const dataBuffer = new Buffer(encryptedBackupPhrase, 'hex')
    const { password } = this.state

    return decrypt(dataBuffer, password)
      .then(backupPhraseBuffer => {
        this.setState(
          {
            upgradeInProgress: true
          },
          () =>
            setTimeout(() => {
              console.debug('decryptKeyAndResetState: correct password!')
              const backupPhrase = backupPhraseBuffer.toString()
              const numberOfIdentities =
                localIdentities.length >= 1 ? localIdentities.length : 1
              this.setState({
                encryptedBackupPhrase,
                backupPhrase,
                defaultIdentityIndex,
                numberOfIdentities
              })
              if (hasLegacyCoreStateVersion()) {
                const migratedApi = migrateLegacyCoreEndpoints(api)
                this.props.migrateAPIEndpoints(migratedApi)
              }
              // clear our state
              this.props.updateState()

              // generate new account and IDs
              this.createAccount().then(() => this.createNewIds())
              .then(() => this.props.refreshIdentities(
                  this.props.api, 
                  this.props.identityAddresses
                ))
            }, 150)
        )
      })
      .catch(error => {
        console.error('decryptKeyAndResetState: invalid password', error)
        this.setState({
          loading: false,
          password: null,
          errors: {
            password: 'Incorrect Password'
          },
          status: 'error'
        })
      })
  }

  /**
   * Submit
   * this will run if our form has been validated correctly
   */
  handleSubmit = async password => {
    this.setState(
      {
        loading: true,
        password
      },
      () => setTimeout(() => this.decryptKeyAndResetState(), 250)
    )
  }

  /**
   * Create account
   * this runs first
   */
  createAccount = async () => {
    const { numberOfIdentities, backupPhrase, password } = this.state

    const { initializeWallet } = this.props

    console.debug(
      'createAccount: state cleared. initializing wallet...',
      password,
      backupPhrase,
      numberOfIdentities
    )
    return initializeWallet(password, backupPhrase, numberOfIdentities)
  }

  /**
   * Generate our IDs
   * this runs after createAccount
   */
  async createNewIds() {
    const { identityAddresses, createNewIdentityWithOwnerAddress } = this.props
    const asyncForEach = async (array, callback) => {
      for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array)
      }
    }

    const generateNids = async () => {
      await asyncForEach(identityAddresses, async (address, i) => {
        console.debug(
          `creating new identity with index: ${i} and ownerAddress: ${address}`
        )
        createNewIdentityWithOwnerAddress(i, address)
      })
      console.debug('finished generating ids')
      this.setState(
        {
          complete: true
        },
        () => {
          setTimeout(() => {
              this.updateStateVersion()
              this.setDefaultIdentityAndRedirectHome()
          }, 250)
        }
      )
    }

    return generateNids()
  }

  /**
   * Update our state version
   * this is our final step once all of our IDs have been generated,
   * it sets the new state version and then redirects home
   */
  updateStateVersion = () => {
    console.debug(
      `updateStateVersion: Setting new state version to ${CURRENT_VERSION}`
    )
    localStorage.setItem(
      BLOCKSTACK_STATE_VERSION_KEY,
      CURRENT_VERSION
    )
  }

  updateStateVersionAndResetOldPersistedData = () => {
    console.debug(
      `updateStateVersionAndResetOldPersistedData: Setting new state version to ${CURRENT_VERSION}`
    )
    localStorage.setItem(
      BLOCKSTACK_STATE_VERSION_KEY,
      CURRENT_VERSION
    )
    console.debug(
      'updateStateVersionAndResetOldPersistedData: removing old persisted data'
    )
    localStorage.removeItem('redux')
  }

  setDefaultIdentityAndRedirectHome = async () => {
    this.props.setDefaultIdentity(this.state.defaultIdentityIndex)
    this.setState({
      view: VIEWS.SUCCESS
    })
  }

  finish() {
    if (this.props.router.location.search) {
      if (this.props.router.location.search.includes('authRequest')) {
        browserHistory.push({
          pathname: '/auth',
          search: this.props.location.search
        })
      }
      if (this.props.router.location.search.includes('encrypted')) {
        browserHistory.push({
          pathname: '/seed',
          search: this.props.location.search
        })
      }
    } else {
      this.props.router.push('/')
    }
  }

  render() {
    const { view } = this.state

    const viewProps = [
      {
        show: VIEWS.INITIAL,
        props: {}
      },
      {
        show: VIEWS.SUCCESS,
        props: {}
      },
      {
        show: VIEWS.NOUPDATE,
        props: {}
      }
    ]

    const currentViewProps = viewProps.find(v => v.show === view) || {}

    const componentProps = {
      view,
      finish: () => this.finish(),
      loading: this.state.loading,
      password: this.state.password,
      errors: this.state.errors,
      handleSubmit: this.handleSubmit,
      upgradeInProgress: this.state.upgradeInProgress,
      updateStateVersion: this.updateStateVersion,
      ...currentViewProps.props
    }
    return (
      <>
        <ShellParent
          app={formatAppManifest(this.props.appManifest)}
          views={views}
          {...componentProps}
          invertOnLast
          disableBackOnView={1}
        />
        <AppHomeWrapper />
      </>
    )
  }
}

UpdatePage.propTypes = {
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

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(UpdatePage)
)
