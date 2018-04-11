import React, { Fragment } from 'react'
import { PanelCard, PanelCardHeader } from '@components/PanelShell'
import styled from 'styled-components'
import { darken } from 'polished'
import { colors } from '@components/styled/theme'
import { space } from 'styled-system'
import { Button, Buttons } from '@components/styled/Button'

const Card = styled.div`
  border-radius: 8px;
  box-shadow: 2px 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid ${darken(0.05, colors.grey[1])};
  background: white;
  ${space};
  * {
    text-align: left !important;
  }
  p {
    margin-bottom: 0;
    padding-bottom: 0;
  }

  & + & {
    margin-top: 20px;
  }
`

const Step = styled.div`
  img {
    max-width: 100%;
    display: block;
  }
`

const Options = ({ previous, ...rest }) => (
  <PanelCard
    renderHeader={() => (
      <PanelCardHeader title="Sign in with Magic Link" pt={0} />
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

Options.propTypes = {}

export default Options
