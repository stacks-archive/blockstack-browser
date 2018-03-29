import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { browserHistory } from 'react-router'
import PanelShell from '../components/PanelShell'
import ProgressBar from '../components/ProgressBar'
import Show from '../components/Show'
import { Email, Username, Password, Hooray } from './views'

const VIEWS = ['EMAIL', 'USERNAME', 'PASSWORD', 'HOORAY']

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

export default class Onboarding extends Component {
  state = {
    email: '',
    password: '',
    username: '',
    seed: SAMPLE_SEED,
    view: 0
  }

  handleValueChange = key => ({ target }) => {
    this.setState({
      [key]: target.value
    })
  }

  updateView = view => () => this.setState({ view })

  render() {
    const { email, password, username, view } = this.state

    const percentProgress = view / VIEWS.length * 100

    return (
      <PanelShell>
        <ProgressBar percent={percentProgress} />
        <Show when={view === 0}>
          <Email
            next={this.updateView(1)}
            email={email}
            handleValueChange={this.handleValueChange('email')}
          />
        </Show>
        <Show when={view === 1}>
          <Username
            previous={this.updateView(0)}
            next={this.updateView(2)}
            email={email}
            username={username}
            handleValueChange={this.handleValueChange('username')}
          />
        </Show>
        <Show when={view === 2}>
          <Password
            previous={this.updateView(1)}
            next={this.updateView(3)}
            password={password}
            handleValueChange={this.handleValueChange('password')}
          />
        </Show>
        <Show when={view === 3}>
          <Hooray
            goToApp={() => {}}
            goToRecovery={() => browserHistory.push('/seed')}
            email={email}
            username={username}
          />
        </Show>
      </PanelShell>
    )
  }
}
