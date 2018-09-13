import React from 'react'
import { ShellScreen, Type, UserAvatar } from '@blockstack/ui'
import PropTypes from 'prop-types'

const user = {
  username: 'Testing',
  suffix: 'id.blockstack',
  id: 'asdfasdfasdfasdf123'
}

const InitialScreen = ({ next, ...rest }) => {
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
        <Type.p>
          Complete your Blockstack ID. One login for 100s of apps. Compeltely private. Secured by blockchain.
        </Type.p>
      )
    },
    actions: {
      items: [
        {
          label: 'Complete your ID',
          onClick: () => next(),
          primary: true
        }
      ]
    }
  }
  return <ShellScreen {...rest} {...props} />
}

InitialScreen.propTypes = {
  next: PropTypes.func.isRequired
}

export default InitialScreen
