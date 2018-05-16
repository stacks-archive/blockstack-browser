import React, { Fragment } from 'react'
import { PanelCard, PanelCardHeader } from '@components/PanelShell'
import styled from 'styled-components'
import { Button, Buttons } from '@components/styled/Button'
import PropTypes from 'prop-types'

const Step = styled.div`
  img {
    max-width: 100%;
    display: block;
  }
`

const Options = ({ previous, ...rest }) => (
  <PanelCard
    renderHeader={() => (
      <PanelCardHeader
        h5="Check your email for the link we sent you when you signed up."
        h2="Restore via Magic Link"
        mdi={'LinkIcon'}
        pt={0}
      />
    )}
    {...rest}
  >
    <Fragment>
      <PanelCard.Section pt={2}>
        <Step>
          <img
            src="https://files-ogipqzmblg.now.sh/Screen%20Shot%202018-04-11%20at%203.21.18%20PM.png"
            alt="step"
          />
          <p>
            Search your email history for <strong>Blockstack + Recovery</strong>
          </p>
        </Step>
      </PanelCard.Section>
      <PanelCard.Section pt={2}>
        <Step>
          <img
            src="https://files-ogipqzmblg.now.sh/Screen%20Shot%202018-04-11%20at%203.21.28%20PM.png"
            alt="step"
          />
          <p>Click the 'Sign in to a new device' button.</p>
        </Step>
      </PanelCard.Section>
      <PanelCard.Section pt={4}>
        <Buttons center>
          <Button onClick={() => previous()} primary>
            Go Back
          </Button>
        </Buttons>
      </PanelCard.Section>
    </Fragment>
  </PanelCard>
)

Options.propTypes = {
  previous: PropTypes.func.isRequired
}

export default Options
