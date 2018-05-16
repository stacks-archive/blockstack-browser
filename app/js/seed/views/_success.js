import React from 'react'
import { ShellScreen, Type } from '@blockstack/ui'

export default ({ next, app, ...rest }) => {
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
          label: 'Continue to Blockstack',
          onClick: () => next(),
          primary: true
        }
      ]
    }
  }
  return <ShellScreen {...rest} {...props} />
}
