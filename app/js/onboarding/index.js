import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import PanelShell from '@components/PanelShell'
import ProgressBar from '@components/ProgressBar'
import Show from '@components/Show'
import { AccountCapture, Hooray, Password, Username, Verify } from './views'
import { encrypt } from '@utils/encryption-utils'
import bip39 from 'bip39'
import { randomBytes } from 'crypto'

const VIEWS = {
  EMAIL: 0,
  VERIFY: 1,
  PASSWORD: 2,
  USERNAME: 3,
  HOORAY: 4
}

function sendBackup({ email, password, seed }) {
  const url = 'http://localhost:5000/backup'

  return encrypt(new Buffer(seed), password).then(encrypted => {
    console.log(encrypted)
    const encryptedPortalKey = encrypted.toString('hex')
    const { protocol, hostname, port } = location
    const thisUrl = `${protocol}//${hostname}${port && `:${port}`}`
    const seedRecovery = `${thisUrl}/seed?encrypted=${encryptedPortalKey}`

    const options = {
      method: 'POST',
      body: JSON.stringify({
        email,
        seedRecovery
      }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }

    return fetch(url, options)
      .then(
        () => {
          console.log(
            `emailNotifications: registered ${email} for notifications`
          )
        },
        error => {
          console.log('emailNotifications: error', error)
        }
      )
      .catch(error => {
        console.log('emailNotifications: error', error)
      })
  })
}

export default class Onboarding extends Component {
  state = {
    email: '',
    password: '',
    username: '',
    seed: '',
    view: VIEWS.EMAIL
  }

  updateValue = (key, value) => {
    this.setState({ [key]: value })
  }

  updateView = view => this.setState({ view })

  // given foo@bar.com, returns foo
  retrieveUsernameFromEmail = email => email.match(/^([^@]*)@/)[1].replace(/[^\w\s]/gi, '')

  submitEmailForVerification = () => {
    const { username, email } = this.state
    if (username.length < 1) {
      this.setState({
        username: this.retrieveUsernameFromEmail(email)
      })
    }
    this.updateView(VIEWS.VERIFY)
  }

  submitUsername = () => {
    const { password, email } = this.state
    const seed = bip39.generateMnemonic(128, randomBytes)
    console.log(seed)
    this.setState({ seed })
    sendBackup({ email, password, seed })
    this.updateView(VIEWS.HOORAY)
  }

  goToBackup = () => {
    browserHistory.push({
      pathname: '/seed',
      state: { seed: this.state.seed }
    })
  }

  render() {
    const { email, password, username, view } = this.state

    return (
      <PanelShell>
        <ProgressBar current={view} total={Object.keys(VIEWS).length} />
        <Show when={view === VIEWS.EMAIL}>
          <AccountCapture
            next={this.submitEmailForVerification}
            email={email}
            password={password}
            updateValue={this.updateValue}
          />
        </Show>
        <Show when={view === VIEWS.VERIFY}>
          <Verify
            next={() => this.updateView(VIEWS.PASSWORD)}
            email={email}
            password={password}
            updateValue={this.updateValue}
          />
        </Show>
        <Show when={view === VIEWS.PASSWORD}>
          <Password
            next={() => this.updateView(VIEWS.USERNAME)}
            email={email}
            password={password}
            updateValue={this.updateValue}
          />
        </Show>
        <Show when={view === VIEWS.USERNAME}>
          <Username
            previous={() => this.updateView(VIEWS.PASSWORD)}
            next={this.submitUsername}
            email={email}
            username={username}
            updateValue={this.updateValue}
          />
        </Show>
        <Show when={view === VIEWS.HOORAY}>
          <Hooray
            goToApp={() => {}}
            goToRecovery={this.goToBackup}
            email={email}
            username={username}
          />
        </Show>
      </PanelShell>
    )
  }
}
