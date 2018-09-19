import * as React from 'react'
import { Flex, Box } from '@components/ui/components/primitives'
import { UserAvatar } from '@components/ui/containers/user'
import { Type } from '@components/ui/components/typography'

export const Title = ({ user, ...p }) => (
  <Box {...p}>
    <Type.h2>{user.username || 'Nameless User'}</Type.h2>
  </Box>
)
export const Suffix = ({ user, ...p }) => (
  <Box opacity={0.5} {...p}>
    <Type.h3>{user.username ? `.${user.suffix}` : `ID-${user.id}`}</Type.h3>
  </Box>
)

export const Line = p => (
  <Flex {...p} alignItems="center" justifyContent="center" my={4}>
    <Box width={85} height={'2px'} bg="whitesmoke" />
  </Flex>
)
export const ProfileScreen = ({ children, user, ...p }) => (
  <Flex
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    style={{
      flexGrow: 1
    }}
  >
    <UserAvatar textSize={24} size={85} {...user} />
    {user && user.username ? (
      <React.Fragment>
        <Title user={user} pt={4} />
        <Suffix user={user} />
      </React.Fragment>
    ) : null}
    <Line />
    <Box textAlign="center">{children}</Box>
  </Flex>
)
