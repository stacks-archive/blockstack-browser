import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { PanelCard } from '@components/PanelShell'
import { Button } from '@components/styled/Button'

const KeyDisclaimer = ({ next }) => (
  <PanelCard>
    <Fragment>
      <PanelCard.Section pt={3} lineHeight={3}>
        <p>
          We use your email to provide you with recovery options for your ID,
          nothing else. <a href="#">Learn more.</a>
        </p>
      </PanelCard.Section>
      <PanelCard.Section pt={3}>
        <Button onClick={next}>I understand, Continue</Button>
      </PanelCard.Section>
    </Fragment>
  </PanelCard>
)

KeyDisclaimer.propTypes = {
  next: PropTypes.func.isRequired
}

export default KeyDisclaimer
