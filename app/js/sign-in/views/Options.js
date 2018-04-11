import React, { Fragment } from 'react'
import { PanelCard, PanelCardHeader } from '@components/PanelShell'
import styled from 'styled-components'
import { darken } from 'polished'
import { colors } from '@components/styled/theme'
import { space } from 'styled-system'
import { Link } from 'react-router'

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
      <PanelCardHeader title="Already have a Blockstack ID?" pt={0} />
    )}
    {...rest}
  >
    <Fragment>
      <PanelCard.Section pt={0}>
        <p>Please select a method below to sign in.</p>
      </PanelCard.Section>
      <PanelCard.Section pt={2}>
        {options.map((option, i) => (
          <Card key={i} onClick={option.action} p={3}>
            <h5>{option.title}</h5>
            <p>{option.description}</p>
          </Card>
        ))}
      </PanelCard.Section>
      <PanelCard.Section pt={4}>
        <p>
          <Link to="/onboarding">
            <a href="#">Don't have a Blockstack ID?</a>
          </Link>
        </p>
      </PanelCard.Section>
    </Fragment>
  </PanelCard>
)

Options.propTypes = {}

export default Options
