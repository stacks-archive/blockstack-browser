import React from 'react'
import PropTypes from 'prop-types'
import { PanelCard, PanelCardHeader } from '@components/PanelShell'
import { Button } from '@components/styled/Button'
import { AccountCircleIcon } from 'mdi-react'
import styled from 'styled-components'

const UserCard = styled.div`
  border-radius: 12px;
  box-shadow: 2px 2px 20px rgba(0, 0, 0, 0.15);
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  background: white;
  text-align: left;
`
const UserCardDetails = styled.div`
  padding-left: 20px;
  max-width: calc(100% - 48px);
  width: 100%;
`

const UserCardAvatar = styled.div`
  border-radius: 100%;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    display: block;
    opacity: 0.25;
  }
`

const User = styled.h3`
  font-weight: bold;
  font-size: 20px;
  text-align: left;
  color: rgba(0, 0, 0, 0.85);
  margin: 0;
  padding: 0 0 10px 0;
  text-transform: capitalize;
  overflow: hidden;
  max-width: 93%;
  text-overflow: ellipsis;
`
const UserID = styled.h4`
  font-size: 16px;
  text-align: left;
  color: rgba(0, 0, 0, 0.5);
  margin: 0;
  padding: 0;
  overflow: hidden;
  max-width: 93%;
  text-overflow: ellipsis;
`

const panelHeader = () => (
  <PanelCardHeader
    title="Welcome to Blockstack"
    appIcon="https://browser.blockstack.org/images/app-icon-dotpodcast-256x256.png"
    pt={4}
  />
)
const Hooray = ({ goToApp, goToRecovery, username, ...rest }) => (
  <PanelCard {...rest} renderHeader={panelHeader}>
    <PanelCard.Section pt={2} center>
      <UserCard>
        <UserCardAvatar>
          <div>
            <AccountCircleIcon size={48} />
          </div>
        </UserCardAvatar>
        <UserCardDetails>
          <User>{username}</User>
          <UserID>{username}.blockstack.id</UserID>
        </UserCardDetails>
      </UserCard>
    </PanelCard.Section>
    <PanelCard.Section pt={4} center>
      <Button primary onClick={() => goToApp()}>
        Continue to Stealthy.im
      </Button>
      <Button secondary onClick={() => goToRecovery()}>
        Write down secret recovery key
      </Button>
    </PanelCard.Section>
    <PanelCard.Section pt={4} center>
      <p>
        Your ID is ready. You need to record your secret recovery key—you’ll
        need it to add Blockstack to new devices or recover.
      </p>
    </PanelCard.Section>
  </PanelCard>
)

Hooray.propTypes = {
  goToApp: PropTypes.func.isRequired,
  goToRecovery: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired
}

export default Hooray
