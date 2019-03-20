/**
 * Success screen
 *
 * This screen welcomes the new user and shows their username / ID
 */
import React from 'react'
import { ShellScreen, Type, Button } from '@blockstack/ui'
import PropTypes from 'prop-types'
import { ProfileScreen, Line } from '@components/ui/containers/profile'
import { Flex, Box } from '@components/ui/components/primitives'

const Success = ({
  finish,
  app,
  goToRecovery,
  username,
  subdomainSuffix,
  id,
  ...rest
}) => {
  const user = subdomainSuffix
    ? {
        username,
        id,
        suffix: subdomainSuffix
      }
    : null

  const props = {
    content: {
      grow: 1,
      children: (
        <ProfileScreen hideLine user={user}>
          <Box pt={3} pb={2}>
            <Button primary onClick={finish}>
              <>Go to {app && app.name ? app.name : 'Blockstack'}</>
            </Button>
          </Box>
          <Line />
          <Flex justifyContent="center" alignItems="center">
            <Type.p>
              Your ID is ready and we sent recovery instructions to your email.
              You can also view your{' '}
              <Type.a onClick={() => goToRecovery()}>
                Secret Recovery Key
              </Type.a>
              .
            </Type.p>
          </Flex>
        </ProfileScreen>
      )
    }
  }
  return <ShellScreen {...rest} {...props} />
}

Success.propTypes = {
  finish: PropTypes.func.isRequired,
  goToRecovery: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  subdomainSuffix: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  app: PropTypes.object
}

export default Success
