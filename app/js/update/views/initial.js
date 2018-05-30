import React from 'react'
import PropTypes from 'prop-types'
import { ShellScreen, Shell } from '@blockstack/ui'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { bindActionCreators } from 'redux'
import { AccountActions } from '../../account/store/account'
import { IdentityActions } from '../../profiles/store/identity'
import { BLOCKSTACK_STATE_VERSION_KEY } from '../../App'
import {
  selectEncryptedBackupPhrase,
  selectIdentityAddresses,
  selectAccountCreated
} from '@common/store/selectors/account'
import {
  selectLocalIdentities,
  selectDefaultIdentity
} from '@common/store/selectors/profiles'
import {
  hasLegacyCoreStateVersion,
  migrateLegacyCoreEndpoints
} from '@utils/api-utils'
import { decrypt } from '@utils'

import {
  CURRENT_VERSION,
  updateState,
  migrateAPIEndpoints
} from '../../store/reducers'
import { selectApi } from '@common/store/selectors/settings'

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

class PasswordView extends React.Component {
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
    accountCreated: false
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

    const dataBuffer = new Buffer(encryptedBackupPhrase, 'hex')
    const { password } = this.state

    await decrypt(dataBuffer, password)
      .then(backupPhraseBuffer => {
        const backupPhrase = backupPhraseBuffer.toString()
        console.debug('decryptKeyAndResetState: correct password!')
        const numberOfIdentities = localIdentities.length
        this.setState({
          encryptedBackupPhrase,
          backupPhrase,
          defaultIdentity: defaultIdentityIndex,
          numberOfIdentities: numberOfIdentities > 0 ? numberOfIdentities : 1,
          upgradeInProgress: true
        })
        if (hasLegacyCoreStateVersion()) {
          const migratedApi = migrateLegacyCoreEndpoints(api)
          this.props.migrateAPIEndpoints(migratedApi)
        }
        // clear our state
        this.props.updateState()

        // generate new account and IDs
        this.createAccount().then(() =>
          this.generateOneOrManyIDs().then(() => this.updateStateVersion())
        )
      })
      .catch(error => {
        console.error('decryptKeyAndResetState: invalid password', error)
        this.setState({
          loading: false,
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
  handleSubmit = async () => {
    this.setState(
      {
        loading: true
      },
      () => setTimeout(() => this.decryptKeyAndResetState(), 250)
    )
  }

  /**
   * Create account
   * this runs first
   */
  createAccount = async () => {
    const {
      upgradeInProgress,
      numberOfIdentities,
      backupPhrase,
      password
    } = this.state

    const { accountCreated, initializeWallet } = this.props

    if (upgradeInProgress && !accountCreated) {
      console.debug('createAccount: state cleared. initializing wallet...')
      initializeWallet(password, backupPhrase, numberOfIdentities)
    }
  }

  /**
   * Generate our IDs
   * this runs after createAccount
   */
  generateOneOrManyIDs = async () => {
    const { upgradeInProgress, accountCreated, numberOfIdentities } = this.state
    const { identityAddresses, createNewIdentityWithOwnerAddress } = this.props
    if (upgradeInProgress && accountCreated && identityAddresses) {
      console.debug(
        'generateOneOrManyIDs: new account created - time to migrate data'
      )

      for (let i = 0; i < numberOfIdentities; i++) {
        console.debug(`componentWillReceiveProps: identity index: ${i}`)
        const ownerAddress = identityAddresses[i]
        createNewIdentityWithOwnerAddress(i, ownerAddress)
        this.setState({
          generatedIDs: i
        })
      }
    }
  }

  /**
   * Update our state version
   * this is our final step once all of our IDs have been generated,
   * it sets the new state version and then redirects home
   */
  updateStateVersion = async () => {
    console.debug(
      `componentWillReceiveProps: Setting new state version to ${CURRENT_VERSION}`
    )
    localStorage.setItem(BLOCKSTACK_STATE_VERSION_KEY, CURRENT_VERSION)

    this.props.setDefaultIdentity(this.state.defaultIdentity)
    this.props.router.push('/')
  }

  /**
   * Validation
   */
  validate = values => {
    console.log('validating')

    // No value checks for both
    const noValues = !values.password || values.password === ''

    // Too short checks for both
    const tooShort = values.password.length < 8

    this.setState({
      status: 'validating',
      errors: undefined
    })

    const errors = {}

    /**
     * No Value checks
     */
    if (noValues) {
      errors.password = 'This is required'
      this.setState({
        status: 'error',
        errors
      })
      throw errors
    }

    /**
     * Min length checks
     */
    if (tooShort) {
      errors.password = 'Password is too short'
      this.setState({
        status: 'error',
        password: values.password,
        errors
      })

      throw errors
    }

    /**
     * Set errors
     */
    if (Object.keys(errors).length) {
      this.setState({
        status: 'error'
      })
      throw errors
    }

    this.setState(
      {
        password: values.password,
        status: 'good-to-go',
        errors: null
      },
      () => this.handleSubmit()
    )
    return null
  }

  static getDerivedStateFromProps(props, state) {
    if (!state.accountCreated && props.accountCreated) {
      return {
        ...state,
        accountCreated: true
      }
    }
    return {
      ...state
    }
  }

  render() {
    const { ...rest } = this.props

    const fields = [
      {
        type: 'password',
        name: 'password',
        label: 'Password',
        message:
          'The password you entered when you created this Blockstack ID.',
        autoFocus: true
      }
    ]

    const props = {
      title: {
        children: 'Enter your password',
        variant: 'h2'
      },
      content: {
        grow: 0,
        form: {
          errors: this.state.errors,
          validate: v => this.validate(v),
          initialValues: { password: '' },
          onSubmit: () => console.log('submit for validation'),
          fields,
          actions: {
            split: true,
            items: [
              {
                label: ' ',
                textOnly: true
              },
              {
                label: 'Continue',
                primary: true,
                type: 'submit',
                icon: 'ArrowRightIcon',
                loading: this.state.loading,
                disabled: this.state.loading
              }
            ]
          }
        }
      }
    }
    return (
      <React.Fragment>
        {this.state.upgradeInProgress ? (
          <Shell.Loading message="Updating Blockstack..." />
        ) : null}
        <ShellScreen {...rest} {...props} />
      </React.Fragment>
    )
  }
}
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(PasswordView)
)
