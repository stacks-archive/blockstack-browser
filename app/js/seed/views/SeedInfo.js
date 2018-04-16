import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { PanelCard, PanelCardHeader } from '@components/PanelShell'
import { Button } from '@components/styled/Button'

const SeedInfo = ({ next, ...rest }) => (
  <PanelCard
    renderHeader={() => (
      <PanelCardHeader
        title={'Backup your secret recovery seed'}
        icon="/images/onboarding/seed-1.png"
        pt={0}
      />
    )}
    {...rest}
  >
    <Fragment>
      <PanelCard.Section pt={0} lineHeight={3}>
        <p>
          Saving your secret recovery key is a reliable way to recover your
          Blockstack ID.
        </p>
        <p>
          Save your secret recovery key a secret place (we suggest writing it on
          paper). Blockstack IDs are fully decentralized, which means anyone who
          has the secret recovery key effectively owns the ID.
        </p>
        <p>
          Your account is secure, but you need to write down your secret
          recovery key.
        </p>
      </PanelCard.Section>
      <PanelCard.Section pt={3}>
        <Button onClick={next} primary>
          View secret recovery key
        </Button>
        <Button onClick={next} secondary>
          Do this later
        </Button>
      </PanelCard.Section>
    </Fragment>
  </PanelCard>
)

SeedInfo.propTypes = {
  next: PropTypes.func.isRequired
}

export default SeedInfo
