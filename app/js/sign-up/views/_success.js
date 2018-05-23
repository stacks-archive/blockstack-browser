import React from 'react'
import { ShellScreen, Type, UserAvatar } from '@blockstack/ui'
import PropTypes from 'prop-types'

const Success = ({
  finish,
  app,
  goToRecovery,
  username,
  subdomainSuffix,
  id,
  ...rest
}) => {
  const user = {
    username,
    id,
    suffix: subdomainSuffix
  }

  const props = {
    headerLabel: 'Welcome to the New Internet',
    title: {
      icon: <UserAvatar {...user} camera />,
      children: <React.Fragment>{user.username}</React.Fragment>,
      variant: 'h2',
      subtitle: {
        light: true,
        children: (
          <React.Fragment>
            {user.username}.{user.suffix}
          </React.Fragment>
        )
      }
    },

    content: {
      grow: 1,
      children: (
        <React.Fragment>
          <Type.p>
            Your ID is ready and secure, but you must record your{' '}
            <strong>Secret Recovery Key</strong> to add new devices or to
            recover this account.
          </Type.p>
        </React.Fragment>
      )
    },
    actions: {
      items: [
        {
          label: (
            <React.Fragment>
              Go to {app.name ? app.name : 'Blockstack'}
            </React.Fragment>
          ),
          primary: true,
          onClick: () => finish()
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

Success.propTypes = {
  finish: PropTypes.func.isRequired,
  goToRecovery: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  subdomainSuffix: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  app: PropTypes.object
}

export default Success
