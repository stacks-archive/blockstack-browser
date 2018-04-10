import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import PanelShell from '@components/PanelShell'
import ProgressBar from '@components/ProgressBar'
import Show from '@components/Show'
import { Email, Verify, Verified, Password, Username, Hooray } from './views'
import { encrypt } from '@utils/encryption-utils'
import bip39 from 'bip39'
import { randomBytes } from 'crypto'

const VIEWS = {
  EMAIL: 0,
  EMAIL_VERIFY: 1,
  EMAIL_VERIFIED: 2,
  PASSWORD: 3,
  USERNAME: 4,
  HOORAY: 5
}

const encryptSeedWithPassword = (password, seed) => (
  encrypt(new Buffer(seed), password)
    .then(encrypted => encrypted.toString('hex'))
)

const cacheEncryptedSeed = (username, encryptedSeed) => {
  let updated = []
  const cachedSeeds = localStorage.getItem('encryptedSeeds')

  if (cachedSeeds) { updated = [...JSON.parse(cachedSeeds)] }
  updated.push({ username, encryptedSeed })

  localStorage.setItem('encryptedSeeds', JSON.stringify(updated))
}

function verifyEmail(email) {
  const url = 'https://obscure-retreat-87934.herokuapp.com/verify'

  const { protocol, hostname, port } = location
  const thisUrl = `${protocol}//${hostname}${port && `:${port}`}`
  const emailVerificationLink = `${thisUrl}/onboarding?verified=${email}`

  const options = {
    method: 'POST',
    body: JSON.stringify({
      email,
      emailVerificationLink
    }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  }

  return fetch(url, options)
    .then(
      () => { console.log(`emailNotifications: sent ${email} an email verification`) },
      error => { console.log('emailNotifications: error', error) }
    )
    .catch(
      error => { console.log('emailNotifications: error', error) }
    )
}

function sendBackup(email, encryptedSeed) {
  const url = 'https://obscure-retreat-87934.herokuapp.com/backup'

  const { protocol, hostname, port } = location
  const thisUrl = `${protocol}//${hostname}${port && `:${port}`}`
  const seedRecovery = `${thisUrl}/seed?encrypted=${encryptedSeed}`

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
      () => { console.log(`emailNotifications: registered ${email} for notifications`) },
      error => { console.log('emailNotifications: error', error) }
    )
    .catch(
      error => { console.log('emailNotifications: error', error) }
    )
}

export default class Onboarding extends Component {
  state = {
    email: '',
    password: '',
    username: '',
    seed: '',
    view: VIEWS.EMAIL
  }

  componentWillMount() {
    const { location } = this.props
    if (location.query.verified) {
      this.setState({ email: location.query.verified })
      this.updateView(VIEWS.EMAIL_VERIFIED)
    }
  }

  updateValue = (key, value) => {
    this.setState({ [key]: value })
  }

  updateView = view => this.setState({ view })

  // given foo@bar.com, returns foo
  retrieveUsernameFromEmail = (email) => email.match(/^([^@]*)@/)[1]

  submitPassword = () => {
    const { username, email } = this.state
    if (username.length < 1) {
      this.setState({
        username: this.retrieveUsernameFromEmail(email)
      })
    }
    this.updateView(VIEWS.USERNAME)
  }

  submitUsername = () => {
    const { password, email, username } = this.state
    const seed = bip39.generateMnemonic(128, randomBytes)

    this.setState({ seed })

    encryptSeedWithPassword(password, seed)
      .then(encryptedSeed => {
        sendBackup(email, encryptedSeed)
        cacheEncryptedSeed(username, encryptedSeed)
      })

    this.updateView(VIEWS.HOORAY)
  }

  goToBackup = () => {
    browserHistory.push({
      pathname: '/seed',
      state: { seed: this.state.seed }
    })
  }

  submitEmailForVerification = () => {
    verifyEmail(this.state.email)
    this.updateView(VIEWS.EMAIL_VERIFY)
  }

  render() {
    const { email, password, username, view } = this.state

    return (
      <PanelShell>
        <ProgressBar current={view} total={Object.keys(VIEWS).length} />
        <Show when={view === VIEWS.EMAIL}>
          <Email
            next={this.submitEmailForVerification}
            email={email}
            updateValue={this.updateValue}
          />
        </Show>
        <Show when={view === VIEWS.EMAIL_VERIFY}>
          <Verify
            email={email}
            resend={this.submitEmailForVerification}
          />
        </Show>
        <Show when={view === VIEWS.EMAIL_VERIFIED}>
          <Verified
            next={() => this.updateView(VIEWS.PASSWORD)}
          />
        </Show>
        <Show when={view === VIEWS.PASSWORD}>
          <Password
            next={this.submitPassword}
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
