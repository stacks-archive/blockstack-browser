import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { PanelCard, PanelCardHeader } from '@components/PanelShell'
import { Button, Buttons, ButtonLink } from '@components/styled/Button'

const SeedComplete = ({ next, ...rest }) => (
  <PanelCard
    renderHeader={() => (
      <PanelCardHeader
        h5="Keep your recovery key private and in a safe place."
        h2="All done!"
        mdi={'StarIcon'}
        pt={0}
      />
    )}
    {...rest}
  >
    <Fragment>
      <PanelCard.Section lineHeight={3} left>
        <p>
          We sent instructions for recovering your Blockstack ID with your key
          to the email you signed up with.
        </p>
        <p>
          Saving your secret recovery key is the most reliable way to recover
          your Blockstack ID. Save your secret recovery key a secret place (we
          suggest writing it on paper). Blockstack IDs are fully decentralized,
          which means anyone who has the secret recovery key effectively owns
          the ID.
        </p>
      </PanelCard.Section>
      <PanelCard.Section pt={3}>
        <Buttons column>
          <Button onClick={() => console.log('continue to app')} primary>
            Continue to Stealthy
          </Button>
          <ButtonLink href="/" secondary>
            Go to Blockstack
          </ButtonLink>
        </Buttons>
      </PanelCard.Section>
    </Fragment>
  </PanelCard>
)

SeedComplete.propTypes = {
  next: PropTypes.func.isRequired
}

export default SeedComplete
