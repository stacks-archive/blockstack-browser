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

function mapStateToProps(state) {
  return {
    encryptedBackupPhrase: state.account.encryptedBackupPhrase
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    Object.assign({}, AccountActions, IdentityActions),
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
      verified: false
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

  setVerified = () => !this.state.verified && this.setState({ verified: true })

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

    decrypt(buffer, password).then(result => {
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
      const seed = this.decryptSeed(password)
      if (seed) {
        this.updateView(VIEWS.SEED)
      }
    }
  }

  finish = () => {
    browserHistory.push({
      pathname: '/',
      state: {}
    })
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
    const { password, view, seed, app } = this.state

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
              this.state.verified ? VIEWS.KEY_COMPLETE : VIEWS.KEY_CONFIRM
            ),
          seed: seed && seed.split(' ')
        }
      },
      {
        show: VIEWS.KEY_CONFIRM,
        props: {
          previous: () => this.updateView(VIEWS.SEED),
          next: () => this.updateView(VIEWS.KEY_COMPLETE),
          seed: seed && seed.split(' '),
          setVerified: () => this.setVerified(),
          verified: this.state.verified
        }
      },
      {
        show: VIEWS.KEY_COMPLETE,
        props: {
          next: () => this.finish()
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
  encryptedBackupPhrase: PropTypes.string
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(SeedContainer)
)
