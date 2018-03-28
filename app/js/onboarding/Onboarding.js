import React, { Component } from 'react'
import PropTypes from 'prop-types'
import PanelShell from './components/PanelShell'
import {
  Email,
  Username,
  Password,
  Hooray,
  Auth,
  KeyInfo,
  UnlockKey,
  Key,
  KeyConfirm,
  KeyComplete,
  RecoveryOptions
} from './views'

const VIEWS = {
  EMAIL: 'EMAIL',
  USERNAME: 'USERNAME',
  PASSWORD: 'PASSWORD',
  HOORAY: 'HOORAY',
  AUTH: 'AUTH',
  KEY_INFO: 'KEY_INFO',
  UNLOCK_KEY: 'UNLOCK_KEY',
  KEY: 'KEY',
  KEY_CONFIRM: 'KEY_CONFIRM',
  KEY_COMPLETE: 'KEY_COMPLETE',
  RECOVERY_OPTIONS: 'RECOVERY_OPTIONS'
}

const Show = ({ children, when }) => when && children

export default class Onboarding extends Component {
  state = {
    email: '',
    password: '',
    username: '',
    view: VIEWS.EMAIL
  }

  handleValueChange = key => ({ target }) => {
    this.setState({
      [key]: target.value
    })
  }

  updateView = view => () => this.setState({ view })

  render() {
    const { email, password, username, view } = this.state

    return (
      <PanelShell>
        <Show when={view === VIEWS.EMAIL}>
          <Email
            next={this.updateView(VIEWS.USERNAME)}
            email={email}
            handleValueChange={this.handleValueChange('email')}
          />
        </Show>
        <Show when={view === VIEWS.USERNAME}>
          <Username
            previous={this.updateView(VIEWS.EMAIL)}
            next={this.updateView(VIEWS.PASSWORD)}
            email={email}
            username={username}
            handleValueChange={this.handleValueChange('username')}
          />
        </Show>
        <Show when={view === VIEWS.PASSWORD}>
          <Password
            previous={this.updateView(VIEWS.USERNAME)}
            next={this.updateView(VIEWS.HOORAY)}
            password={password}
            handleValueChange={this.handleValueChange('password')}
          />
        </Show>
        <Show when={view === VIEWS.HOORAY}>
          <Hooray
            goToApp={() => {}}
            goToRecovery={this.updateView(VIEWS.KEY_INFO)}
            email={email}
            username={username}
          />
        </Show>
      </PanelShell>
    )
  }
}
