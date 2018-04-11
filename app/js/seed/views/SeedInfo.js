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
          Your recovery seed is the primary method to recover or transfer your
          ID to a new device. If anyone has your recovery seed, they will have
          full access to your IDs.
        </p>
      </PanelCard.Section>
      <PanelCard.Section pt={3}>
        <Button onClick={next} primary>
          I understand, let's get started.
        </Button>
        <Button onClick={next} secondary>
          Remind me later
        </Button>
      </PanelCard.Section>
    </Fragment>
  </PanelCard>
)

SeedInfo.propTypes = {
  next: PropTypes.func.isRequired
}

export default SeedInfo
