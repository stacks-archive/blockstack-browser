import React from 'react'
import PropTypes from 'prop-types'
import { Person } from 'blockstack'
import { Buttons, ShellScreen, Type, UserButton, Shell } from '@blockstack/ui'
const basicInfo = 'read your basic info'
const readEmail = 'read your email address'
const publishData = 'publish data stored for this app'

const Accounts = ({ list, handleClick, processing, refreshingIdentities, selectedIndex }) => {
  let loadingMessage = null
  if (processing) {
    loadingMessage = 'Signing in...'
  } else if (refreshingIdentities) {
    loadingMessage = 'Loading...'
  }
  if (list.length) {
    return list.map(({ username, ownerAddress, profile, ...account }, i) => {
      const person = new Person(profile)
      return (
        <UserButton
          key={i}
          username={username || `ID-${ownerAddress}`}
          id={ownerAddress}
          avatarUrl={person.avatarUrl()}
          onClick={() => handleClick(i)}
          loading={refreshingIdentities || (processing && i === selectedIndex)}
          disabled={refreshingIdentities || processing}
          placeholder={loadingMessage}
          style={{ transform: 'translate3d(0,0,0)' }}
          hideID
        />
      )
    })
  }
  return null
}

const PermissionsList = ({ list }) =>
  list.length === 1 ? (
    <strong>{list[0]}</strong>
  ) : (
    list.map((item, i) => {
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
    })
  )
const cleanAppDomain = url => {
  if (url) {
    return url.replace(/http(s)?:\/\//i, '')
  } else {
    return 'Unknown domain'
  }
}
/**
 * TODO: give more details on what these permissions mean
 */
const PermissionsContent = ({ permissions, app, appDomain }) => (
  <Type.p>
    "{app && app.name}" ({cleanAppDomain(appDomain)}) wants to{' '}
    <PermissionsList list={permissions} />. Select an ID to use:
  </Type.p>
)
const InitialScreen = ({
  app,
  appDomain,
  accounts,
  permissions,
  processing,
  selectedIndex,
  login,
  refreshingIdentities,
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
        <>
          <PermissionsContent
            permissions={generatePermissionsList()}
            app={app}
            appDomain={appDomain}
          />
          <Buttons flexDirection="column" overflow>
            <Accounts
              list={accounts}
              handleClick={login}
              processing={processing}
              refreshingIdentities={refreshingIdentities}
              selectedIndex={selectedIndex}
            />
          </Buttons>
        </>
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
  appDomain: PropTypes.string,
  accounts: PropTypes.array,
  permissions: PropTypes.array,
  processing: PropTypes.bool,
  selectedIndex: PropTypes.number,
  login: PropTypes.func,
  refreshingIdentities: PropTypes.bool
}
Accounts.propTypes = {
  list: PropTypes.array.isRequired,
  handleClick: PropTypes.func,
  processing: PropTypes.bool,
  selectedIndex: PropTypes.number,
  refreshingIdentities: PropTypes.bool
}

PermissionsList.propTypes = {
  list: PropTypes.array.isRequired
}
PermissionsContent.propTypes = {
  permissions: PropTypes.array.isRequired,
  app: PropTypes.object,
  appDomain: PropTypes.string
}
export default InitialScreen
