import React from 'react'
import PropTypes from 'prop-types'
import { ShellScreen, Type } from '@blockstack/ui'

const LegacyGaiaScreen = ({ app, backView, ...rest }) => {
  if (!app) {
    return null
  }

  const props = {
    title: {
      children: 'Sorry!'
    },
    content: {
      grow: 1,
      children: (
        <>
          <Type.p>
            This application uses an older Gaia storage library, which is no
            longer supported. Once the application updates its library, you will
            be able to use it.
          </Type.p>
          <Type.p>
            You could try to reach out to the developers of {app.name} and
            request they update to the latest version of Gaia.
          </Type.p>
        </>
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
LegacyGaiaScreen.propTypes = {
  app: PropTypes.object,
  backView: PropTypes.func
}

export default LegacyGaiaScreen
