import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Show from '@components/Show'
import { SeedInfo, SeedDecrypt, Seed, SeedConfirm, SeedComplete } from './views'
import PanelShell from '@components/PanelShell'
import { decrypt } from '@utils/encryption-utils'

const VIEWS = {
  KEY_INFO: 0,
  UNLOCK_KEY: 1,
  KEY_1: 2,
  KEY_2: 3,
  KEY_3: 4,
  KEY_CONFIRM: 5,
  KEY_COMPLETE: 6,
  RECOVERY_OPTIONS: 7
}

const splitSeed = seed => {
  // to-do: make this function smarter
  const x = seed ? seed.split(' ') : []
  return {
    first: [x[0], x[1], x[2], x[3]],
    second: [x[4], x[5], x[6], x[7]],
    third: [x[8], x[9], x[10], x[11]]
  }
}

export default class SeedContainer extends Component {
  state = {
    encryptedSeed: null,
    seed: null,
    view: VIEWS.KEY_INFO
  }

  static propTypes = {
    location: PropTypes.object.isRequired
  }

  componentWillMount() {
    const { location } = this.props
    if (location.query.encrypted) {
      this.setState({ encryptedSeed: location.query.encrypted })
    } else if (location && location.state && location.state.seed) {
      this.setState({
        seed: location.state.seed
      })
    }
  }

  updateValue = (key, value) => {
    this.setState({ [key]: value })
  }

  updateView = view => this.setState({ view })

  decryptSeed = password => {
    const buffer = new Buffer(this.state.encryptedSeed, 'hex')

    decrypt(buffer, password).then(result => {
      this.setState({
        view: VIEWS.KEY_1,
        seed: result.toString()
      })
    })
  }

  startBackup = () => {
    const nextView = this.state.seed ? VIEWS.KEY_1 : VIEWS.UNLOCK_KEY
    this.updateView(nextView)
  }

  render() {
    const { password, view, seed } = this.state
    const seedList = splitSeed(seed)
    return (
      <PanelShell>
        <Show when={view === VIEWS.KEY_INFO}>
          <SeedInfo
            next={() =>
              this.updateView(this.state.seed ? VIEWS.KEY_1 : VIEWS.UNLOCK_KEY)
            }
          />
        </Show>
        <Show when={view === VIEWS.UNLOCK_KEY}>
          <SeedDecrypt
            previous={() => this.updateView(VIEWS.KEY_INFO)}
            next={() => this.updateView(VIEWS.KEY_1)}
            password={password}
            decryptSeed={this.decryptSeed}
          />
        </Show>
        <Show when={view === VIEWS.KEY_1}>
          <Seed
            previous={() => this.updateView(VIEWS.KEY_INFO)}
            next={() => this.updateView(VIEWS.KEY_2)}
            seed={seedList.first}
            set={1}
          />
        </Show>
        <Show when={view === VIEWS.KEY_2}>
          <Seed
            previous={() => this.updateView(VIEWS.KEY_1)}
            next={() => this.updateView(VIEWS.KEY_3)}
            seed={seedList.second}
            set={2}
          />
        </Show>
        <Show when={view === VIEWS.KEY_3}>
          <Seed
            previous={() => this.updateView(VIEWS.KEY_2)}
            next={() => this.updateView(VIEWS.KEY_CONFIRM)}
            seed={seedList.third}
            set={3}
          />
        </Show>
        <Show when={view === VIEWS.KEY_CONFIRM}>
          <SeedConfirm
            previous={() => this.updateView(VIEWS.KEY_3)}
            next={() => this.updateView(VIEWS.KEY_COMPLETE)}
          />
        </Show>
        <Show when={view === VIEWS.KEY_COMPLETE}>
          <SeedComplete />
        </Show>
      </PanelShell>
    )
  }
}
