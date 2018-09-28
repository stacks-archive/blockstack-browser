import React from 'react'
import PropTypes from 'prop-types'
import { Button, firstLetter, stringToColor, Type } from '@blockstack/ui'
import { User } from '@blockstack/ui/components/user'
import CheckIcon from 'mdi-react/CheckIcon'
import ChevronRightIcon from 'mdi-react/ChevronRightIcon'
import Image from '@components/Image'
import { Flex } from '@components/ui/components/primitives'

const UserAvatar = ({
  id,
  username,
  size = 46,
  camera,
  textSize = 14,
  avatarUrl = '',
  ...rest
}) => (
  <User.Avatar
    size={size}
    color={stringToColor(id)}
    textSize={textSize}
    camera={camera}
    {...rest}
  >
    {avatarUrl ? (
      <Image
        src={avatarUrl}
        fallbackSrc="/images/avatar.png"
        className="rounded-circle img-cover"
        style={{
          display: 'inline-block',
          width: '100%',
          height: '100%'
        }}
      />
    ) : (
      <Flex>
        {username ? (
          firstLetter(username || '?')
        ) : (
          <CheckIcon size={42} color="white" />
        )}
      </Flex>
    )}
    {camera && <User.Avatar.Camera />}
  </User.Avatar>
)

const UserButton = ({ username, id, hideID, avatarUrl, ...rest }) => (
  <Button
    height={56}
    primary
    padding="5px"
    labelProps={{ width: '100%' }}
    {...rest}
  >
    <Button.Section>
      <UserAvatar username={username} avatarUrl={avatarUrl} id={id} />
    </Button.Section>
    <Button.Section
      style={{ flexGrow: 1 }}
      flexDirection="column"
      px="10px"
      alignItems="flex-start"
      justifyContent="center"
      cd
      maxWidth="calc(100% - 102px) !important"
    >
      <Type.p color="rgba(255,255,255,1)" textAlign="left" width="100%" overflow>
        {username.includes('.') ? (
          <>
            <span style={{ color: 'rgba(255,255,255,1)' }}>
              {username.substr(0, username.indexOf('.'))}
            </span>
            <span style={{ color: 'rgba(255,255,255,0.5' }}>
              .
              {username
                .split('.')
                .slice(1)
                .join('.')}
            </span>
          </>
        ) : (
          <span style={{ color: 'rgba(255,255,255,1)' }}>{username}</span>
        )}
      </Type.p>
      {id &&
        !hideID && <Type.small color="rgba(255,255,255,0.5)">{id}</Type.small>}
    </Button.Section>
    <Button.Section
      align="center"
      justify="center"
      padding="0 10px 0 10px"
      mr="auto"
    >
      <ChevronRightIcon size={24} color="white" />
    </Button.Section>
  </Button>
)

UserAvatar.propTypes = {
  id: PropTypes.string,
  username: PropTypes.string,
  size: PropTypes.number,
  camera: PropTypes.bool,
  textSize: PropTypes.number,
  avatarUrl: PropTypes.string
}
UserButton.propTypes = {
  id: PropTypes.string,
  username: PropTypes.string,
  hideID: PropTypes.bool,
  avatarUrl: PropTypes.string
}
export { UserButton, UserAvatar }
