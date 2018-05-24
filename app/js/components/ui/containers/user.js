import { Button, firstLetter, stringToColor, Type } from '@blockstack/ui'
import { User } from '@blockstack/ui/components/user'
import React from 'react'
import { ChevronRightIcon } from 'mdi-react'

const UserAvatar = ({
  id,
  username = '?',
  size = 46,
  camera,
  textSize = 14,
  ...rest
}) => (
  <User.Avatar
    size={size}
    color={stringToColor(id)}
    textSize={textSize}
    camera={camera}
    {...rest}
  >
    {firstLetter(username)}
    {camera && <User.Avatar.Camera />}
  </User.Avatar>
)

const UserButton = ({ username, id, hideID, ...rest }) => (
  <Button height={56} primary padding="5px" {...rest}>
    <Button.Section>
      <UserAvatar username={username} id={id} />
    </Button.Section>
    <Button.Section
      grow
      column
      padding="0 10px"
      align="flex-start"
      justify="center"
      cd
      maxWidth="calc(100% - 90px)"
    >
      <Type.p color="rgba(255,255,255,1)">
        {username.includes('.') ? (
          <React.Fragment>
            <span style={{ color: 'rgba(255,255,255,1)' }}>
              {username.substr(0, username.indexOf('.'))}
            </span>
            <span style={{ color: 'rgba(255,255,255,0.5' }}>
              .{username
                .split('.')
                .slice(1)
                .join('.')}
            </span>
          </React.Fragment>
        ) : (
          <span style={{ color: 'rgba(255,255,255,1)' }}>{username}</span>
        )}
      </Type.p>
      {id &&
        !hideID && <Type.small color="rgba(255,255,255,0.5)">{id}</Type.small>}
    </Button.Section>
    <Button.Section align="center" justify="center" padding="0 10px 0 10px">
      <ChevronRightIcon size={24} color="white" />
    </Button.Section>
  </Button>
)

export { UserButton, UserAvatar }
