import React from 'react'
import { ShellScreen, Type } from '@blockstack/ui'
import PropTypes from 'prop-types'
import { ProfileScreen } from '@components/ui/containers/profile'

class Success extends React.Component {
  state = {
    namelessUser: false,
    recoveryKey: false
  }

  render() {
    const { next, app, goToRecovery, username = '?', id, ...rest } = this.props
    const name = username.includes('.') ? username.split('.')[0] : null
    const user =
      username !== '?'
        ? {
            ...this.props.user,
            id,
            username,
            name,
            suffix: username.replace(`${name}.`, '')
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
              <>
                Go to {app && app.name ? app.name : 'Blockstack'}
              </>
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
