import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { PanelCard, PanelCardHeader } from '@components/PanelShell'
import { Button } from '@components/styled/Button'

const SeedComplete = ({ next, ...rest }) => (
  <PanelCard
    renderHeader={() => (
      <PanelCardHeader
        title="Done! Keep your recovery seed private and safe."
        icon="/images/onboarding/seed-2.png"
        pt={0}
      />
    )}
    {...rest}
  >
    <Fragment>
      <PanelCard.Section lineHeight={3}>
        <p>
          We sent instructions for recovering your Blockstack ID with your seed
          to the email you signed up with.
        </p>
        <p>
          Saving your secret recovery key is a durable way to recover your
          Blockstack ID. Save your secret recovery key a secret place (we
          suggest writing it on paper). Blockstack IDs are fully decentralized,
          which means anyone who has the secret recovery key effectively owns
          the ID.
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

SeedComplete.propTypes = {
  next: PropTypes.func.isRequired
}

export default SeedComplete
