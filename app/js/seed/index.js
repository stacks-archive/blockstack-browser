import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Initial, Password, Seed, SeedConfirm, Success } from './views'
import { decrypt } from '@utils/encryption-utils'
import { withRouter, browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { AccountActions } from '../account/store/account'
import { IdentityActions } from '../profiles/store/identity'
import { ShellParent } from '@blockstack/ui'
import {
  selectEncryptedBackupPhrase,
  selectRecoveryCodeVerified
} from '@common/store/selectors/account'
import {
  selectAppManifest,
  selectAuthRequest
} from '@common/store/selectors/auth'
import { formatAppManifest } from '@common'

function mapStateToProps(state) {
  return {
    encryptedBackupPhrase: selectEncryptedBackupPhrase(state),
    appManifest: selectAppManifest(state),
    authRequest: selectAuthRequest(state),
    verified: selectRecoveryCodeVerified(state)
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      ...AccountActions,
      ...IdentityActions
    },
    dispatch
  )
}

const views = [Initial, Password, Seed, SeedConfirm, Success]

const VIEWS = {
  KEY_INFO: 0,
  UNLOCK_KEY: 1,
  SEED: 2,
  KEY_CONFIRM: 3,
  KEY_COMPLETE: 4
}

class SeedContainer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      encryptedBackupPhrase: props.encryptedBackupPhrase || null,
      view: 0,
      seed: undefined,
      loading: false,
      decrypting: false
    }
  }

  componentWillMount() {
    const cachedSeed = this.getCachedEncryptedSeed()
    if (cachedSeed.seed) {
      if (this.state.seed !== cachedSeed.seed) {
        this.setState({ seed: cachedSeed.seed })
      }
    } else if (cachedSeed.cached) {
      if (this.state.encryptedBackupPhrase !== cachedSeed.cached) {
        this.setState({ encryptedBackupPhrase: cachedSeed.cached })
      }
    }
  }

  setVerified = () =>
    !this.props.verified ? this.props.doVerifyRecoveryCode() : null

  updateValue = (key, value) => {
    this.setState({ [key]: value })
  }

  updateView = view => {
    if (this.state.view !== view) {
      this.setState({ view })
    }
  }

  getCachedEncryptedSeed = () => {
    const cached = this.props.encryptedBackupPhrase
    const { location } = this.props
    if (location && location.state && location.state.password) {
      return {
        seed: this.decryptSeed(location.state.password.toString()),
        cached
      }
    } else {
      return {
        cached
      }
    }
  }

  decryptSeed = password => {
    if (
      !this.state.encryptedBackupPhrase &&
      !this.props.encryptedBackupPhrase
    ) {
      return null
    }
    const buffer = new Buffer(
      this.state.encryptedBackupPhrase || this.props.encryptedBackupPhrase,
      'hex'
    )

    return decrypt(buffer, password).then(result => {
      if (this.state.seed !== result.toString()) {
        this.setState({
          seed: result.toString()
        })
        return result.toString()
      } else {
        return null
      }
    })
  }

  passwordNext = password => {
    if (!this.state.seed && !this.state.password) {
      this.setState({
        password,
        loading: true
      })
    }
  }

  componentDidUpdate(prevProps, prevState, prevContext) {
    if (
      !this.state.seed &&
      this.state.password &&
      this.state.loading &&
      !this.state.decrypting
    ) {
      this.setState(
        {
          decrypting: true
        },
        () => setTimeout(() => this.decryptSeed(this.state.password), 250)
      )
    }
    if (this.state.seed && this.state.view === VIEWS.UNLOCK_KEY) {
      setTimeout(() => this.updateView(VIEWS.SEED), 250)
    }
  }

  finish = () => {
    if (formatAppManifest(this.props.appManifest) && this.props.authRequest) {
      return this.redirectToAuth()
    } else {
      return browserHistory.push({
        pathname: '/',
        state: {}
      })
    }
  }

  /**
   * Redirect to Auth Request
   */
  redirectToAuth = () => {
    this.props.router.push(`/auth/?authRequest=${this.props.authRequest}`)
  }

  backView = () => {
    switch (this.state.view) {
      case VIEWS.KEY_INFO:
        return null
      case VIEWS.UNLOCK_KEY:
        return this.updateView(VIEWS.KEY_INFO)
      case VIEWS.SEED:
        return this.updateView(VIEWS.KEY_INFO)
      case VIEWS.KEY_CONFIRM:
        return this.updateView(VIEWS.SEED)
      case VIEWS.KEY_COMPLETE:
        return this.updateView(VIEWS.SEED)
      default:
        return null
    }
  }

  render() {
    const { password, view, seed } = this.state

    const viewProps = [
      {
        show: VIEWS.KEY_INFO,
        props: {
          next: () =>
            this.updateView(this.state.seed ? VIEWS.SEED : VIEWS.UNLOCK_KEY)
        }
      },
      {
        show: VIEWS.UNLOCK_KEY,
        props: {
          loading: this.state.loading,
          previous: () => this.updateView(VIEWS.KEY_INFO),
          next: p => this.passwordNext(p),
          password
        }
      },
      {
        show: VIEWS.SEED,
        props: {
          previous: () => this.updateView(VIEWS.KEY_INFO),
          next: () =>
            this.updateView(
              this.props.verified ? VIEWS.KEY_COMPLETE : VIEWS.KEY_CONFIRM
            ),
          seed: seed && seed.toString().split(' '),
          seedString: seed && seed.toString()
        }
      },
      {
        show: VIEWS.KEY_CONFIRM,
        props: {
          previous: () => this.updateView(VIEWS.SEED),
          next: () => this.updateView(VIEWS.KEY_COMPLETE),
          seed: seed && seed.toString().split(' '),
          setVerified: () => this.setVerified(),
          verified: this.props.verified
        }
      },
      {
        show: VIEWS.KEY_COMPLETE,
        props: {
          finish: () => this.finish(),
          buttonLabel:
            formatAppManifest(this.props.appManifest) && this.props.authRequest
              ? `Go to ${formatAppManifest(this.props.appManifest).name}`
              : 'Go to Blockstack'
        }
      }
    ]

    const currentViewProps = viewProps.find(v => v.show === view) || {}

    const componentProps = {
      password,
      view,
      backView: () => this.backView(),
      ...currentViewProps.props
    }

    const app = formatAppManifest(this.props.appManifest)

    return (
      <ShellParent
        app={app}
        views={views}
        {...componentProps}
        headerLabel="Secure your account"
        invertOnLast
        backOnLast
      />
    )
  }
}

SeedContainer.propTypes = {
  location: PropTypes.object.isRequired,
  appManifest: PropTypes.object,
  encryptedBackupPhrase: PropTypes.string,
  authRequest: PropTypes.string,
  verified: PropTypes.bool.isRequired
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(SeedContainer)
)
