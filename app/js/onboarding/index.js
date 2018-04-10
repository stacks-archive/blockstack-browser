import React from 'react'
import { browserHistory } from 'react-router'
import PanelShell from '@components/PanelShell'
import ProgressBar from '@components/ProgressBar'
import Show from '@components/Show'
import { AccountCapture, Hooray, Password, Username, Verify } from './views'
import { encrypt } from '@utils/encryption-utils'
import bip39 from 'bip39'
import { randomBytes } from 'crypto'
import { Spring, animated } from 'react-spring'
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

export default class Onboarding extends React.Component {
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
  retrieveUsernameFromEmail = email =>
    email.match(/^([^@]*)@/)[1].replace(/[^\w\s]/gi, '')

  submitEmailForVerification = () => {
    const { username, email } = this.state
    if (username.length < 1) {
      this.setState({
        username: this.retrieveUsernameFromEmail(email),
        email
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

    const views = [
      {
        show: VIEWS.EMAIL,
        Component: AccountCapture,
        props: {
          email,
          password,
          username,
          next: this.submitEmailForVerification,
          previous: null,
          updateValue: this.updateValue
        }
      },
      {
        show: VIEWS.VERIFY,
        Component: Verify,
        props: {
          email,
          password,
          username,
          next: () => this.updateView(VIEWS.PASSWORD),
          previous: null,
          updateValue: this.updateValue
        }
      },
      {
        show: VIEWS.PASSWORD,
        Component: Password,
        props: {
          email,
          password,
          username,
          next: () => this.updateView(VIEWS.USERNAME),
          previous: null,
          updateValue: this.updateValue
        }
      },
      {
        show: VIEWS.USERNAME,
        Component: Username,
        props: {
          email,
          password,
          username,
          next: () => this.submitUsername,
          previous: () => this.updateView(VIEWS.PASSWORD),
          updateValue: this.updateValue
        }
      },
      {
        show: VIEWS.HOORAY,
        Component: Hooray,
        props: {
          email,
          password,
          username,
          goToRecovery: this.goToBackup,
          goToApp: () => console.log('go to app!'),
          next: () => this.submitUsername,
          previous: () => this.updateView(VIEWS.PASSWORD),
          updateValue: this.updateValue
        }
      }
    ]

    const renderItems = items =>
      items.map(({ show, props, Component }, i) => (
        <Show key={i} when={view === show}>
          <Spring
            native
            from={{ opacity: 0 }}
            to={{ opacity: view === show ? 1 : 0 }}
            config={{ tension: 2, friction: 3 }}
          >
            {styles => (
              <animated.div style={styles}>
                <Component {...props} style={styles} showing={view === show} />
              </animated.div>
            )}
          </Spring>
        </Show>
      ))

    return (
      <PanelShell>
        <ProgressBar current={view} total={Object.keys(VIEWS).length} />
        {renderItems(views)}
      </PanelShell>
    )
  }
}
