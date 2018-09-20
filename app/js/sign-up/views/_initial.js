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
          Completely censorship free, private, and secure. One login for 100s of apps. Powered by blockchain.
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
          label: 'Sign in with an existing ID',
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
