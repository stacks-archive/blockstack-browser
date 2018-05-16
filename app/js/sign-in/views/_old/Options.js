import React, { Fragment } from 'react'
import { PanelCard, PanelCardHeader } from '@components/PanelShell'
import { Link } from 'react-router'
import { Button } from '@components/styled/Button'
import PropTypes from 'prop-types'

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

Options.propTypes = {
  options: PropTypes.array
}

export default Options
