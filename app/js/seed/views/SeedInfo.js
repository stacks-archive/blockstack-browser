import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { PanelCard, PanelCardHeader } from '@components/PanelShell'
import { Button, ButtonLink, Buttons } from '@components/styled/Button'

const SeedInfo = ({ next, ...rest }) => (
  <PanelCard
    renderHeader={() => (
      <PanelCardHeader
        h5="Save your secret recovery key forever"
        h2="Recovery Key"
        mdi={'TextboxPasswordIcon'}
        pt={0}
      />
    )}
    {...rest}
  >
    <Fragment>
      <PanelCard.Section pt={0} pb={4} lineHeight={3} left>
        <p>
          Your recovery key is the most reliable way to recover your Blockstack
          ID. It's important to save your recovery key in a safe place (we
          suggest writing it on paper).
        </p>
        <p>
          Blockstack IDs are fully decentralized, which means anyone who has the
          secret recovery key effectively owns the ID. Please save your recovery
          key.
        </p>
      </PanelCard.Section>
      <PanelCard.Section pt={3} pb={72}>
        <Buttons bottom column>
          <Button onClick={next} primary>
            View Secret Recovery Key
          </Button>
          <ButtonLink href="/" secondary>
            Do this later
          </ButtonLink>
        </Buttons>
      </PanelCard.Section>
    </Fragment>
  </PanelCard>
)

SeedInfo.propTypes = {
  next: PropTypes.func.isRequired
}

export default SeedInfo
