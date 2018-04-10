import React from 'react'
import PropTypes from 'prop-types'
import { PanelCard, PanelCardHeader } from '@components/PanelShell'
import { Button } from '@components/styled/Button'

const panelHeader = () => (
  <PanelCardHeader
    title="Your email is verified"
    appIcon="https://browser.blockstack.org/images/app-icon-dotpodcast-256x256.png"
  />
)

const Verified = ({ next, ...rest }) => (
  <PanelCard renderHeader={panelHeader} {...rest}>
    <PanelCard.Section pt={4} center>
      <p>
        Let{"'"}s finish up your account now.
      </p>
    </PanelCard.Section>
    <PanelCard.Section pt={2} center>
      <Button onClick={next} primary>
        Continue
      </Button>
    </PanelCard.Section>
  </PanelCard>
)

Verified.propTypes = {
  email: PropTypes.string,
  next: PropTypes.func
}

export default Verified
