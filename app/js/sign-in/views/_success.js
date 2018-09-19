import React from 'react'
import { ShellScreen, Type, UserAvatar } from '@blockstack/ui'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import { ProfileScreen } from '@components/ui/containers/profile'

const messages = {
  namelessUser: (
    <Type.small padding="15px 0 0 0">
      It looks like your account doesn't have a username, if this is a newer
      account, it will take a bit of time for your username to propagate
      throughout the network completely. Or if this is an older account, you
      might have to register a username.
    </Type.small>
  ),
  recoveryKey: (
    <Type.small padding="15px 0 0 0">
      Your Secret Recovery Key is the 12 word phrase that was used to generate
      your account. If you have not recorded your Secret Recovery Key for this
      account, we strongly recommended you do now.
    </Type.small>
  )
}

class Success extends React.Component {
  state = {
    namelessUser: false,
    recoveryKey: false
  }

  toggleMessage = key => {
    this.setState(state => ({
      [key]: !state[key]
    }))
  }

  render() {
    const { next, app, goToRecovery, username = '?', id, ...rest } = this.props

    const user =
      username !== '?'
        ? {
            id,
            username,
            name: username.includes('.') ? username.split('.')[0] : null
          }
        : null

    const props = {
      content: {
        grow: 1,
        children: (
          <ProfileScreen user={user}>
            <Type.p>
              Your ID has been restored.
              <br />
              We recommend you view and save
              <br />
              your{' '}
              <Type.a onClick={() => goToRecovery()}>
                Secret&nbsp;Recovery&nbsp;Key
              </Type.a>
              .
            </Type.p>
          </ProfileScreen>
        )
      },
      actions: {
        items: [
          {
            label: (
              <React.Fragment>
                Go to {app && app.name ? app.name : 'Blockstack'}
              </React.Fragment>
            ),
            primary: true,
            onClick: () => next()
          }
        ]
      }
    }
    return <ShellScreen {...rest} {...props} />
  }
}

Success.propTypes = {
  finish: PropTypes.func.isRequired,
  next: PropTypes.func.isRequired,
  goToRecovery: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  subdomainSuffix: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  app: PropTypes.object
}

export default Success
