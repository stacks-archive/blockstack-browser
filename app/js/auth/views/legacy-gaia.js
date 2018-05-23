import React from 'react'
import {
  ShellScreen,
  Type,
} from '@blockstack/ui'

export default ({ app, backView, ...rest }) => {
  if (!app) {
    return null
  }

  const props = {
    title: {
      children: 'Select an ID'
    },
    content: {
      grow: 1,
      children: (
        <React.Fragment>
          <Type.p>
            This application uses an older Gaia storage library, which is no
            longer supported. Once the application updates its library, you will
            be able to use it.
          </Type.p>
        </React.Fragment>
      )
    },
    actions: {
      items: [
        {
          label: 'Go back',
          onClick: () => backView()
        }
      ]
    }
  }
  return <ShellScreen {...rest} {...props} />
}
