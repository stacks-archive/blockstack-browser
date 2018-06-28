import React from 'react'
import { ShellScreen, Type } from '@blockstack/ui'
import PropTypes from 'prop-types'
const InitialScreen = ({ next, ...rest }) => {
  const props = {
    title: {
      children: 'Create your Blockstack ID'
    },
    content: {
      grow: 1,
      children: (
        <Type.p>
          Blockstack ID gives you control over your fundamental digital rights:
          Identity, data ownership, privacy, and security.
        </Type.p>
      )
    },
    actions: {
      items: [
        {
          label: 'Create a new Blockstack ID',
          onClick: () => next(),
          primary: true
        },
        {
          label: 'Restore a Blockstack ID',
          to: '/sign-in'
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
