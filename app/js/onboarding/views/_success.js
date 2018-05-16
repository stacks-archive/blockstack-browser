import React from 'react'
import { ShellScreen, Type, UserAvatar } from '@blockstack/ui'
import PropTypes from 'prop-types'

const Success = ({
  finish,
  appName = 'Blockstack',
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
        children: <React.Fragment>{user.username + user.suffix}</React.Fragment>
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
          label: <React.Fragment>Go to {appName}</React.Fragment>,
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
  appIconURL: PropTypes.string,
  appName: PropTypes.string
}

export default Success
