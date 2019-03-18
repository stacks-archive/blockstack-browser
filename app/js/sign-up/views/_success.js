/**
 * Success screen
 *
 * This screen welcomes the new user and shows their username / ID
 */
import React from 'react'
import { ShellScreen, Type } from '@blockstack/ui'
import PropTypes from 'prop-types'
import { ProfileScreen } from '@components/ui/containers/profile'
import { Flex } from '@components/ui/components/primitives'

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
    title: {
      children: (
        <ProfileScreen 
          user={user} 
          justifyContent="center"
          alignItems="center"
          style={{
            justifyContent: "center",
            alignItems: "center"
          }}
        >
        </ProfileScreen>
      )
    },
    content: {
      grow: 1,
      form: {
        fields: [],
        actions: {
          items: [
            {
              label: (
                <>
                  Go to {app && app.name ? app.name : 'Blockstack'}
                </>
              ),
              primary: true,
              onClick: () => finish()
            }
          ]
        }
      },
      children: (
        <Flex
          justifyContent="center"
          alignItems="center"
        >
          <Type.p>
            Your ID is ready and we sent recovery instructions to your email.
            You can also view your{' '}
            <Type.a onClick={() => goToRecovery()}>Secret Recovery Key</Type.a>.
          </Type.p>
        </Flex>
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
