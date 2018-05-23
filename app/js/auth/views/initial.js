import React from 'react'
import {
  Buttons,
  HelperMessage,
  ShellScreen,
  Type,
  UserButton,
  Button
} from '@blockstack/ui'

const permissions = ['read your basic info', 'publish data stored for this app']

const accounts = [
  {
    username: 'gina.blockstack.id',
    id: '1b6453892473a467d07372d45eb05abc2031647a'
  },
  {
    username: 'thomasosmonson.blockstack.id',
    id: 'c1dfd96eea8cc2b62785275bca38ac261256e278'
  }
]

export default ({ app, ...rest }) => {
  if (!app) {
    return <div>need an app!</div>
      }

  const Accounts = ({ list }) => (
    <React.Fragment>
      {list.length
        ? list.map((account, i) => <UserButton key={i} {...account} hideID />)
        : null}
    </React.Fragment>
  )

  const PermissionsList = ({ list }) => (
    <React.Fragment>
      {list.map((item, i) => {
        if (i !== list.length - 1) {
          return (
            <React.Fragment key={i}>
              <strong>{item}</strong>
              {', '}
            </React.Fragment>
          )
        } else {
          return (
            <React.Fragment key={i}>
              {' '}
              and <strong>{item}</strong>
            </React.Fragment>
          )
        }
      })}
    </React.Fragment>
  )
  const PermissionsContent = ({
    permissions,
    helperMessage = 'What do these permissions mean?'
  }) => (
    <React.Fragment>
      <Type.p>
        <strong>"{app && app.name}"</strong> wants to{' '}
        <PermissionsList list={permissions} />.
      </Type.p>
      <HelperMessage message={helperMessage} />
    </React.Fragment>
  )
  const props = {
    title: {
      children: 'Select an ID'
    },
    content: {
      grow: 1,
      children: (
        <React.Fragment>
          <PermissionsContent permissions={permissions} />
          <Buttons column>
            <Accounts list={accounts} />
            <Button label="User a different ID" />
          </Buttons>
        </React.Fragment>
      )
    },
    actions: {
      items: [
        {
          label: 'Deny',
          onClick: () => secondary(),
          negative: true
        }
      ]
    }
  }
  return <ShellScreen {...rest} {...props} />
}
