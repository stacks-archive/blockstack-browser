import React from 'react'
import { ShellScreen, Type } from '@blockstack/ui'

const SeedInitial = ({ next, ...rest }) => {
  const props = {
    headerLabel: 'Secure your account',
    title: {
      children: 'Please save your Secret Recovery Key'
    },
    content: {
      grow: 1,
      children: (
        <React.Fragment>
          <Type.p>
            Your recovery key is the most reliable way to recover your
            Blockstack ID. It's important to save your recovery key in a safe
            place (<em>we suggest writing it on paper</em>).
          </Type.p>
          <Type.p>
            <strong>Blockstack IDs are fully decentralized</strong>, which means
            anyone who has the secret recovery key effectively owns the ID.
            Please save your recovery key.
          </Type.p>
        </React.Fragment>
      )
    },
    actions: {
      items: [
        {
          label: 'View Secret Recovery Key',
          onClick: () => next(),
          primary: true
        },
        {
          label: 'Do this later',
          to: '/'
        }
      ]
    }
  }
  return <ShellScreen {...rest} {...props} />
}

export default SeedInitial
