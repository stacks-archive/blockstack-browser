import React from 'react'
import { ShellScreen, Type } from '@blockstack/ui'
import PropTypes from 'prop-types'

const SeedInitial = ({ next, loading, placeholder, ...rest }) => {
  const props = {
    title: {
      children: 'Please Save your Secret Recovery Key'
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
          label: 'Record Secret Recovery Key',
          onClick: () => next(),
          primary: true,
          loading,
          disabled: loading,
          placeholder
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

SeedInitial.propTypes = {
  next: PropTypes.func,
  loading: PropTypes.bool,
  placeholder: PropTypes.node
}

export default SeedInitial
