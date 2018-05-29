import React from 'react'
import PropTypes from 'prop-types'
import { Buttons, ShellScreen, Type, UserButton, Shell } from '@blockstack/ui'
const basicInfo = 'read your basic info'
const readEmail = 'read your email address'
const publishData = 'publish data stored for this app'

const Accounts = ({ list, handleClick, processing, selectedIndex }) => {
  if (list.length) {
    return list.map(({ username, ownerAddress, ...account }, i) => (
      <UserButton
        key={i}
        username={username || `ID-${ownerAddress}`}
        id={ownerAddress}
        onClick={() => handleClick(i)}
        loading={processing && i === selectedIndex}
        placeholder="Logging in..."
        hideID
      />
    ))
  }
  return null
}

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
const PermissionsContent = ({ permissions, app }) => (
  <React.Fragment>
    <Type.p>
      <strong>"{app && app.name}"</strong> wants to{' '}
      <PermissionsList list={permissions} />.
    </Type.p>
  </React.Fragment>
)
const InitialScreen = ({
  app,
  accounts,
  permissions,
  processing,
  selectedIndex,
  login,
  ...rest
}) => {
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

  const props = {
    title: {
      children: 'Select an ID'
    },
    content: {
      grow: 1,
      children: !app ? (
        <Shell.Loading />
      ) : (
        <React.Fragment>
          <PermissionsContent
            permissions={generatePermissionsList()}
            app={app}
          />
          <Buttons column>
            <Accounts
              list={accounts}
              handleClick={login}
              processing={processing}
              selectedIndex={selectedIndex}
            />
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

InitialScreen.propTypes = {
  app: PropTypes.object,
  accounts: PropTypes.array,
  permissions: PropTypes.array,
  processing: PropTypes.bool,
  selectedIndex: PropTypes.number,
  login: PropTypes.func
}
Accounts.proptype = {
  list: PropTypes.array.isRequired,
  handleClick: PropTypes.func,
  processing: PropTypes.bool,
  selectedIndex: PropTypes.number
}

PermissionsList.propTypes = {
  list: PropTypes.array.isRequired
}
PermissionsContent.propTypes = {
  permissions: PropTypes.array.isRequired,
  app: PropTypes.object
}
export default InitialScreen
