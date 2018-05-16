import React from 'react'
import { ShellScreen, Type, UserAvatar } from '@blockstack/ui'
export default ({ next, app, invert, user, ...rest }) => {
  if (!user) {
    return null
  }
  const buttons = app
    ? [
        {
          label: <React.Fragment>Go to {app.name}</React.Fragment>,
          primary: true,
          onClick: () => next()
        },
        {
          label: 'Go to Blockstack',
          onClick: () => next()
        }
      ]
    : [
        {
          label: 'Go to Blockstack',
          primary: true,
          onClick: () => next()
        }
      ]

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
          <Type.p>Your Blockstack ID has been restored.</Type.p>
        </React.Fragment>
      )
    },
    actions: {
      items: [...buttons]
    }
  }
  return <ShellScreen {...rest} {...props} />
}
