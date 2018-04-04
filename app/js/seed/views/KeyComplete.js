import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { PanelCard, PanelCardHeader } from '@components/PanelShell'
import { Button } from '@components/styled/Button'

const KeyDisclaimer = ({ next }) => (
  <PanelCard
    renderHeader={() => (
      <PanelCardHeader
        title="Done! Keep your recovery seed private and safe."
        icon="/images/onboarding/seed-2.png"
        pt={0}
      />
    )}
  >
    <Fragment>
      <PanelCard.Section pt={3} lineHeight={3}>
        <p>
          We sent instructions for recovering your Blockstack ID with your seed
          to the email you signed up with.
        </p>
      </PanelCard.Section>
      <PanelCard.Section pt={3}>
        <Button onClick={() => console.log('continue to app')} primary>
          Continue to Stealthy
        </Button>
      </PanelCard.Section>
    </Fragment>
  </PanelCard>
)

KeyDisclaimer.propTypes = {
  next: PropTypes.func.isRequired
}

export default KeyDisclaimer
