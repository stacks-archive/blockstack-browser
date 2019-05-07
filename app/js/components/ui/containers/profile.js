import * as React from 'react'
import { Flex, Box } from '@components/ui/components/primitives'
import { UserAvatar } from '@components/ui/containers/user'
import { Type } from '@components/ui/components/typography'

export const Title = ({ user, ...p }) => (
  <Flex
    {...p}
    alignItems="center"
    justifyContent="center"
    style={{ overflow: 'hidden' }}
    width="100%"
  >
    <Type.h2
      display="block"
      style={{
        textAlign: 'center',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis'
      }}
      m={0}
      width="100%"
      maxWidth={['calc(100% - 60px)', 'calc(100% - 40px)']}
    >
      {user.username && user.username.includes('.')
        ? user.username.split('.')[0]
        : user.username}
    </Type.h2>
  </Flex>
)
export const Suffix = ({ user, ...p }) => (
  <Box opacity={0.5} {...p}>
    <Type.h3>{user.username ? `.${user.suffix}` : `ID-${user.id}`}</Type.h3>
  </Box>
)

export const Line = p => (
  <Flex {...p} alignItems="center" justifyContent="center" my={3}>
    <Box width={85} height={'2px'} bg="whitesmoke" />
  </Flex>
)
export const ProfileScreen = ({ children, user, hideLine }) => {
  const avatarUrl =
    user && user.profile && user.profile.image && user.profile.image.length
      ? user.profile.image[0].contentUrl
      : undefined

  return (
    <Flex
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      width={1}
      style={{
        flexGrow: 1
      }}
    >
      <UserAvatar textSize={24} size={85} avatarUrl={avatarUrl} {...user} />
      {user && user.username ? (
        <>
          <Title user={user} pt={3} />
          <Suffix user={user} />
        </>
      ) : null}
      {hideLine ? null : <Line />}
      <Box textAlign="center">{children}</Box>
    </Flex>
  )
}
