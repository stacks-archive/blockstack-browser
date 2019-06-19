import React, { useState } from 'react'
import { ShellScreen, Type } from '@blockstack/ui'
import { Box } from 'blockstack-ui'
import PropTypes from 'prop-types'

const InitialSignOutScreen = ({ location, ...rest }) => {
  const [hasAttempted, setAttempted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleResetClick = () => {
    if (!hasAttempted) {
      setAttempted(true)
    } else {
      setLoading(true)
      localStorage.clear()
      window.location =
        location.query && location.query.redirect_uri
          ? `${location.query.redirect_uri}://?authCleared=1`
          : '/sign-up'
    }
  }

  const handleCancelClick = () => {
    window.location =
      location.query && location.query.redirect_uri
        ? `${location.query.redirect_uri}://?authCleared=0`
        : '/sign-up'
  }

  const screen = {
    title: {
      children: 'Sign Out'
    },
    content: {
      grow: 1,
      children: (
        <>
          <Box
            borderRadius="3px"
            mb={3}
            bg="#fff3cd"
            border="1px solid #ffeeba"
            p={2}
          >
            <Type.p style={{ margin: 0 }}>
              <strong>Warning:</strong> This will erase your account data on
              this device. You’ll have to restore your account or create a new
              one afterwards.
            </Type.p>
          </Box>
          <Type.p style={{ margin: 0 }}>
            If you plan to restore your account, make sure you have recorded
            your backup information: you will either need your{' '}
            <strong>12 word secret recovery key</strong>, or your{' '}
            <strong>magic recovery code and password</strong> to do so.
          </Type.p>
        </>
      )
    },
    actions: {
      items: [
        {
          label: hasAttempted ? (
            <>Press Again to Confirm</>
          ) : (
            <>Reset my Device</>
          ),
          loading,
          disabled: loading,
          primary: true,
          onClick: handleResetClick
        },
        {
          label: <>Cancel</>,
          primary: false,
          onClick: handleCancelClick
        }
      ]
    }
  }

  return <ShellScreen {...rest} {...screen} />
}

InitialSignOutScreen.propTypes = {
  location: PropTypes.object,
  value: PropTypes.string
}

export default InitialSignOutScreen
