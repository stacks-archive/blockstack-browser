import React from 'react'
import { ShellScreen, Type } from '@blockstack/ui'
import PropTypes from 'prop-types'

const SeedInitial = ({ next, loading, placeholder, ...rest }) => {
  const props = {
    title: {
      children: (
        <React.Fragment>Save your Secret Recovery&nbsp;Key</React.Fragment>
      )
    },
    content: {
      grow: 1,
      children: (
        <React.Fragment>
          <Type.p pt={2}>
            Your Secret Recovery Key is the most reliable way to access your
            Blockstack ID.
          </Type.p>
          <Type.p>
            Blockstack cannot reset your key. Save your key wherever you keep
            important, secret information.
          </Type.p>
        </React.Fragment>
      )
    },
    actions: {
      items: [
        {
          label: 'Secret Recovery Key',
          onClick: () => next(),
          primary: true,
          loading,
          disabled: loading,
          placeholder
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
