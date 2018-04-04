import React, { Component } from 'react'
import Show from '@components/Show'
import { KeyInfo, UnlockKey, Key, KeyConfirm, KeyComplete } from './views'
import PanelShell from '@components/PanelShell'

const VIEWS = [
  'KEY_INFO',
  'UNLOCK_KEY',
  'KEY',
  'KEY_CONFIRM',
  'KEY_COMPLETE',
  'RECOVERY_OPTIONS'
]

export default class Seed extends Component {
  state = {
    password: '',
    view: VIEWS[0]
  }

  handleValueChange = key => ({ target }) => {
    this.setState({
      [key]: target.value
    })
  }

  updateView = view => () => this.setState({ view })

  render() {
    const { password, view } = this.state

    return (
      <PanelShell>
        <Show when={view === VIEWS[0]}>
          <KeyInfo
            next={this.updateView(VIEWS[1])}
            handleValueChange={this.handleValueChange('password')}
          />
        </Show>
        <Show when={view === VIEWS[1]}>
          <UnlockKey
            previous={this.updateView(VIEWS[0])}
            next={this.updateView(VIEWS[2])}
            password={password}
            handleValueChange={this.handleValueChange('password')}
          />
        </Show>
        <Show when={view === VIEWS[2]}>
          <Key
            previous={this.updateView(VIEWS[1])}
            next={this.updateView(VIEWS[3])}
          />
        </Show>
        <Show when={view === VIEWS[3]}>
          <KeyConfirm
            previous={this.updateView(VIEWS[2])}
            next={this.updateView(VIEWS[4])}
          />
        </Show>
        <Show when={view === VIEWS[4]}>
          <KeyComplete />
        </Show>
      </PanelShell>
    )
  }
}
