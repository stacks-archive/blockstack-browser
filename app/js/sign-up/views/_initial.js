import React from 'react'
import { ShellScreen, Type } from '@blockstack/ui'
import { Flex } from '@components/ui/components/primitives'
import PropTypes from 'prop-types'
const InitialScreen = ({ next, ...rest }) => {
  const props = {
    content: {
      grow: 1,
      children: (
        <Flex
          style={{ flexGrow: 1 }}
          justifyContent="center"
          flexDirection="column"
        >
          <Type.h1 pb={3}>Create your Blockstack ID</Type.h1>
          <Type.p>
            Completely censorship free, private, and secure. One login for 100s
            of apps. Powered by blockchain.
          </Type.p>
        </Flex>
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
