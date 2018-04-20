import React from 'react'
import PropTypes from 'prop-types'
import { PanelCard, PanelCardHeader } from '@components/PanelShell'
import { Button, ButtonLink, Buttons } from '@components/styled/Button'
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
  font-weight: 600;
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
  font-weight: 400;
  overflow: hidden;
  max-width: 93%;
  text-overflow: ellipsis;
`

const panelHeader = () => (
  <PanelCardHeader
    title="Welcome to Blockstack"
    appIcon="https://browser.blockstack.org/images/app-icon-stealthy-256x256.png"
    pt={4}
  />
)
const Hooray = ({ goToRecovery, username, ...rest }) => (
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
      <Buttons column>
        <ButtonLink
          primary
          href="https://browser.blockstack.org/auth?authRequest=eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJqdGkiOiI1ZWViOWRkZi1mNzVkLTRjODItYTJlNS1hY2QzMmRkNzViYTYiLCJpYXQiOjE1MjQwNzA0MzksImV4cCI6MTUyNDA3NDAzOSwiaXNzIjoiZGlkOmJ0Yy1hZGRyOjExMnNYUUVWRjNOY0phZDVzWHBUMVhpd0s0RVlwRXY5YzUiLCJwdWJsaWNfa2V5cyI6WyIwMzI5ODM3NzQwMTlkZDNkMmRiOTlmMDBlMzczNDg0MzhlNmQwMDhmNjgxYmQ1YTA2ZWVmMjE4MzA2ZWFiZWNmM2UiXSwiZG9tYWluX25hbWUiOiJodHRwczovL3d3dy5zdGVhbHRoeS5pbSIsIm1hbmlmZXN0X3VyaSI6Imh0dHBzOi8vd3d3LnN0ZWFsdGh5LmltL21hbmlmZXN0Lmpzb24iLCJyZWRpcmVjdF91cmkiOiJodHRwczovL3d3dy5zdGVhbHRoeS5pbSIsInZlcnNpb24iOiIxLjEuMCIsImRvX25vdF9pbmNsdWRlX3Byb2ZpbGUiOnRydWUsInN1cHBvcnRzX2h1Yl91cmwiOnRydWUsInNjb3BlcyI6WyJzdG9yZV93cml0ZSIsInB1Ymxpc2hfZGF0YSJdfQ.KW8eDtUNjCk3r6RuPRX8JLeRuDY9ZiwB31Csnv3ogib4r1wtGDfWRN1RQKbyJXAuudI8FsVHEAt3ZNe5EtoGgA#coreAPIPassword=off&logServerPort=off&regtest=off"
        >
          Continue to Stealthy.im
        </ButtonLink>
        <Button secondary onClick={() => goToRecovery()}>
          Write down secret recovery key
        </Button>
      </Buttons>
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
