import React from 'react'
import { browserHistory, withRouter } from 'react-router'
import PropTypes from 'prop-types'
import PanelShell, { renderItems } from '@components/PanelShell'
import ProgressBar from '@components/ProgressBar'
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

const encryptSeedWithPassword = (password, seed) =>
  encrypt(new Buffer(seed), password).then(encrypted =>
    encrypted.toString('hex')
  )

const cacheEncryptedSeed = (username, encryptedSeed) => {
  let updated = []
  const cachedSeeds = localStorage.getItem('encryptedSeeds')

  if (cachedSeeds) {
    updated = [...JSON.parse(cachedSeeds)]
  }
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
      () => {
        console.log(`emailNotifications: sent ${email} an email verification`)
      },
      error => {
        console.log('emailNotifications: error', error)
      }
    )
    .catch(error => {
      console.log('emailNotifications: error', error)
    })
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
      () => {
        console.log(`emailNotifications: registered ${email} for notifications`)
      },
      error => {
        console.log('emailNotifications: error', error)
      }
    )
    .catch(error => {
      console.log('emailNotifications: error', error)
    })
}

class Onboarding extends React.Component {
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

  updateURL = view => {
    const historyChange = slug => {
      if (this.props.location.pathname !== `/sign-up/${slug}`) {
        return this.props.router.push(`/sign-up/${slug}`, this.state)
      } else {
        return null
      }
    }

    switch (view) {
      case VIEWS.EMAIL_VERIFY:
        return historyChange('verify')
      case VIEWS.PASSWORD:
        return historyChange('password')
      case VIEWS.USERNAME:
        return historyChange('username')
      case VIEWS.HOORAY:
        return historyChange('success')
      default:
        return null
    }
  }

  componentDidUpdate() {
    this.updateURL(this.state.view)
  }

  updateValue = (key, value) => {
    this.setState({ [key]: value })
  }

  updateView = view => this.setState({ view })

  // given foo@bar.com, returns foo
  retrieveUsernameFromEmail = email =>
    email.match(/^([^@]*)@/)[1].replace(/[^\w\s]/gi, '')

  submitPassword = () => {
    const { username, email } = this.state
    if (username.length < 1) {
      this.setState({
        username: this.retrieveUsernameFromEmail(email),
        email
      })
    }
    this.updateView(VIEWS.USERNAME)
  }

  submitUsername = () => {
    const { password, email, username } = this.state
    const seed = bip39.generateMnemonic(128, randomBytes)

    this.setState({ seed })

    encryptSeedWithPassword(password, seed).then(encryptedSeed => {
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

    const views = [
      {
        show: VIEWS.EMAIL,
        Component: Email,
        props: {
          email,
          next: this.submitEmailForVerification,
          updateValue: this.updateValue
        }
      },
      {
        show: VIEWS.EMAIL_VERIFY,
        Component: Verify,
        props: {
          email,
          resend: this.submitEmailForVerification,
          next: () => this.updateView(VIEWS.PASSWORD)
        }
      },
      {
        show: VIEWS.EMAIL_VERIFIED,
        Component: Verified,
        props: {
          next: () => this.updateView(VIEWS.PASSWORD)
        }
      },
      {
        show: VIEWS.PASSWORD,
        Component: Password,
        props: {
          password,
          next: this.submitPassword,
          updateValue: this.updateValue
        }
      },
      {
        show: VIEWS.USERNAME,
        Component: Username,
        props: {
          username,
          next: this.submitUsername,
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
          goToApp: () => console.log('go to app!')
        }
      }
    ]

    return (
      <PanelShell>
        <ProgressBar current={view} total={Object.keys(VIEWS).length} />
        {renderItems(views, view)}
      </PanelShell>
    )
  }
}

Onboarding.propTypes = {
  location: PropTypes.object,
  router: PropTypes.object
}

export default withRouter(Onboarding)
