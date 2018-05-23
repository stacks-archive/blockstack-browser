import React from 'react'
import {
  Buttons,
  HelperMessage,
  ShellScreen,
  Type,
  UserButton,
  Button
} from '@blockstack/ui'

const basicInfo = 'read your basic info'
const readEmail = 'read your email address'
const publishData = 'publish data stored for this app'

export default ({
  app,
  accounts,
  permissions,
  processing,
  selectedIndex,
  login,
  ...rest
}) => {
  if (!app) {
    return null
  }

  const generatePermissionsList = () => {
    const permarray = [basicInfo]
    if (permissions.email) {
      permarray.push(readEmail)
    }
    if (permissions.publishData) {
      permarray.push(publishData)
    }
    return permarray
  }

  const Accounts = ({ list, handleClick }) =>
    list.length
      ? list.map((account, i) => (
          <UserButton
            key={i}
            username={account.username || `ID-${account.ownerAddress}`}
            id={account.ownerAddress}
            onClick={() => handleClick(i)}
            loading={processing && i === selectedIndex}
            placeholder={'Logging in...'}
            hideID
          />
        ))
      : null
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
  /**
   * TODO: give more details on what these permissions mean
   */
  const PermissionsContent = ({
    permissions,
    helperMessage = 'What do these permissions mean?'
  }) => (
    <React.Fragment>
      <Type.p>
        <strong>"{app && app.name}"</strong> wants to{' '}
        <PermissionsList list={permissions} />.
      </Type.p>
      {/*<HelperMessage message={helperMessage} />*/}
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
          <PermissionsContent permissions={generatePermissionsList()} />
          <Buttons column>
            <Accounts list={accounts} handleClick={login} />
            <Button label="Use a different ID" to="/sign-up" />
          </Buttons>
        </React.Fragment>
      )
    },
    actions: {
      items: [
        {
          label: 'Deny',
          to: '/',
          negative: true
        }
      ]
    }
  }
  return <ShellScreen {...rest} {...props} />
}
