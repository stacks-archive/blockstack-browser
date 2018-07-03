import React from 'react'
import PropTypes from 'prop-types'
import { ShellScreen, Type } from '@blockstack/ui'

const SuccessScreen = ({ finish, buttonLabel, ...rest }) => {
  const props = {
    title: {
      children: 'Save your Secret Recovery Key forever'
    },
    content: {
      grow: 1,
      children: (
        <React.Fragment>
          <Type.p>
            Your secret recovery key is the most reliable way to recover your
            ID. It is important to save this key in a safe place (we suggest
            writing it on paper).
          </Type.p>
          <Type.p>
            Blockstack IDs are decentralized, meaning, anyone who has the secret
            recovery key effectively owns this ID. Please save your recovery
            key!
          </Type.p>
        </React.Fragment>
      )
    },
    actions: {
      items: [
        {
          label: buttonLabel,
          onClick: () => finish(),
          primary: true
        }
      ]
    }
  }
  return <ShellScreen {...rest} {...props} />
}
SuccessScreen.propTypes = {
  finish: PropTypes.func,
  buttonLabel: PropTypes.node
}

export default SuccessScreen
