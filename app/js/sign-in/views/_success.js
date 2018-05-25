import React from 'react'
import { ShellScreen, Type, UserAvatar } from '@blockstack/ui'
import PropTypes from 'prop-types'

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
    const {
      next,
      app,
      goToRecovery,
      username = '?',
      subdomainSuffix,
      id,
      ...rest
    } = this.props

    const user = {
      username,
      id,
      suffix: subdomainSuffix
    }

    const props = {
      headerLabel: 'Welcome to the New Internet',
      title: {
        icon: <UserAvatar {...user} />,
        children: (
          <React.Fragment>
            {username === '?' ? 'Nameless User' : user.username}
          </React.Fragment>
        ),
        variant: 'h2',
        subtitle: {
          light: true,
          overflow: true,
          variant: username === '?' ? 'small' : 'h3',
          children: (
            <React.Fragment>
              {username === '?'
                ? `ID-${id}`
                : `${user.username}.${user.suffix}`}
            </React.Fragment>
          )
        }
      },

      content: {
        grow: 1,
        children: (
          <React.Fragment>
            <React.Fragment>
              <Type.p>
                Welcome back to the New Internet. Your account has successfully
                been restored on this device.
              </Type.p>
              {username === '?' ? (
                <React.Fragment>
                  <Type.h4
                    padding="15px 0 0 0"
                    onClick={() => this.toggleMessage('namelessUser')}
                  >
                    Why is my username 'Nameless&nbsp;User'?
                  </Type.h4>
                  {this.state.namelessUser && messages.namelessUser}
                </React.Fragment>
              ) : null}
              <Type.h4
                padding="15px 0 0 0"
                onClick={() => this.toggleMessage('recoveryKey')}
              >
                What is my secret recovery key?
              </Type.h4>
              {this.state.recoveryKey && messages.recoveryKey}
            </React.Fragment>
          </React.Fragment>
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
          },
          {
            label: 'View Secret Recovery Key',
            onClick: () => goToRecovery()
          }
        ]
      }
    }
    return <ShellScreen {...rest} {...props} />
  }
}

Success.propTypes = {
  finish: PropTypes.func.isRequired,
  goToRecovery: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  subdomainSuffix: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  app: PropTypes.object
}

export default Success
