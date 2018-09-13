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
    title: {
      icon: <UserAvatar {...user} />,
      children: <React.Fragment>{user.username || 'Nameless User'}</React.Fragment>,
      variant: 'h2',
      subtitle: {
        light: true,
        children: (
          <React.Fragment>
            {user.username ? `${user.username}.${user.suffix}` : `ID-${user.id}`}
          </React.Fragment>
        ),
        style: {
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }
      }
    },

    content: {
      grow: 1,
      children: (
        <React.Fragment>
          <Type.p>
            Your Blockstack ID is ready. One login for 100s of apps. Completely private. Secured by the blockchain.
          </Type.p>
        </React.Fragment>
      )
    },
    actions: {
      items: [
        {
          label: (
            <React.Fragment>
              Sign in to Publik with your ID
            </React.Fragment>
          ),
          primary: true,
          onClick: () => finish()
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
