import React from 'react'
import PropTypes from 'prop-types'
import { PanelCard } from '@components/PanelShell'
import { Button } from '@components/styled/Button'

const Hooray = ({ goToApp, goToRecovery, username }) => (
  <PanelCard variant="welcome">
    <PanelCard.Section pt={5} center>
      <h2>Welcome</h2>
      <h3>{username}.blockstack.id</h3>
    </PanelCard.Section>
    <PanelCard.Section pt={4} center>
      <Button primary invert onClick={() => goToApp()}>
        Continue to Stealthy.im
      </Button>
      <Button secondary invert onClick={() => goToRecovery()}>
        Write down recovery seed
      </Button>
    </PanelCard.Section>
    <PanelCard.Section pt={4} center>
      <p>
        Your ID is ready. You need to record your secret recovery
        seed&mdash;you'll need it to login to Blockstack on new devices, or to
        recover your ID. <a href="#">Learn more.</a>
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
