import React, { Component } from 'react'
import Show from '@components/Show'
import { KeyInfo, UnlockKey, Key, KeyConfirm, KeyComplete } from './views'
import PanelShell from '@components/PanelShell'

const VIEWS = [
  'KEY_INFO',
  'UNLOCK_KEY',
  'KEY-1',
  'KEY-2',
  'KEY-3',
  'KEY_CONFIRM',
  'KEY_COMPLETE',
  'RECOVERY_OPTIONS'
]
/**
 * Sample seed, we'll get this dynamically from somewhere else
 */
const SAMPLE_SEED = [
  'CARROT',
  'FIGARO',
  'DESOLATE',
  'MEANDER',
  'FUNNY',
  'LAWNCHAIR',
  'MEXICO',
  'SOLSTICE',
  'CABIN',
  'BOTTLE',
  'MARINADE',
  'FLYING'
]

const SEED_SETS = {
  first: [SAMPLE_SEED[0], SAMPLE_SEED[1], SAMPLE_SEED[2], SAMPLE_SEED[3]],
  second: [SAMPLE_SEED[4], SAMPLE_SEED[5], SAMPLE_SEED[6], SAMPLE_SEED[7]],
  third: [SAMPLE_SEED[8], SAMPLE_SEED[9], SAMPLE_SEED[10], SAMPLE_SEED[11]]
}

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
            seed={SEED_SETS.first}
            set={1}
          />
        </Show>
        <Show when={view === VIEWS[3]}>
          <Key
            previous={this.updateView(VIEWS[2])}
            next={this.updateView(VIEWS[4])}
            seed={SEED_SETS.second}
            set={2}
          />
        </Show>
        <Show when={view === VIEWS[4]}>
          <Key
            previous={this.updateView(VIEWS[3])}
            next={this.updateView(VIEWS[5])}
            seed={SEED_SETS.third}
            set={3}
          />
        </Show>
        <Show when={view === VIEWS[5]}>
          <KeyConfirm
            previous={this.updateView(VIEWS[4])}
            next={this.updateView(VIEWS[6])}
          />
        </Show>
        <Show when={view === VIEWS[6]}>
          <KeyComplete />
        </Show>
      </PanelShell>
    )
  }
}
