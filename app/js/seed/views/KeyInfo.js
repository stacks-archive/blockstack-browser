import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { PanelCard, PanelCardHeader } from '@components/PanelShell'
import { Button } from '@components/styled/Button'

const KeyDisclaimer = ({ next }) => (
  <PanelCard
    renderHeader={() => (
      <PanelCardHeader
        title={'Generate your secret recovery seed'}
        icon="/images/onboarding/seed-1.png"
        pt={0}
      />
    )}
  >
    <Fragment>
      <PanelCard.Section pt={0} lineHeight={3}>
        <p>
          Your recovery seed is the primary method to recover or transfer your
          ID to a new device. Things you'll need:{' '}pen, paper, and a secret hiding place.
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

KeyDisclaimer.propTypes = {
  next: PropTypes.func.isRequired
}

export default KeyDisclaimer
