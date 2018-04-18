import React, { Fragment } from 'react'
import { PanelCard, PanelCardHeader } from '@components/PanelShell'
import styled from 'styled-components'
import { darken } from 'polished'
import { colors } from '@components/styled/theme'
import { space } from 'styled-system'
import { Link } from 'react-router'
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

const Options = ({ options, ...rest }) => (
  <PanelCard
    renderHeader={() => (
      <PanelCardHeader
        h5="Select from the options below to restore your Blockstack ID on this device."
        h2="Restore your ID"
        mdi={'AccountConvertIcon'}
        pt={0}
        full
      />
    )}
    {...rest}
  >
    <Fragment>
      {options.map((option, i) => (
        <PanelCard.Section pt={2} key={i}>
          <Button primary onClick={option.action}>
            {option.title}
          </Button>
          <p style={{ paddingTop: '18px' }}>{option.description}</p>
        </PanelCard.Section>
      ))}

      <PanelCard.Section pt={4}>
        <p>
          <Link to="/sign-up">Don't have a Blockstack ID?</Link>
        </p>
      </PanelCard.Section>
    </Fragment>
  </PanelCard>
)

Options.propTypes = {}

export default Options
