import React from 'react'
import PropTypes from 'prop-types'
import { ShellScreen, Type } from '@blockstack/ui'
import {Box} from '@components/ui/components/primitives'

const SuccessScreen = ({ finish, buttonLabel, ...rest }) => {
  const props = {
    title: {
      children: <>Save your Secret Recovery&nbsp;Key</>
    },
    content: {
      grow: 1,
      children: (
        <Box pt={3}>
          <Type.p>
            Your Secret Recovery Key is the most reliable way to access your
            Blockstack ID.
          </Type.p>
          <Type.p>
            Blockstack cannot reset your key. Save your key wherever you keep
            important, secret information.
          </Type.p>
        </Box>
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
