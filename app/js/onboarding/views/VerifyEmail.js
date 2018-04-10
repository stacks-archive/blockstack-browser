import React from 'react'
import PropTypes from 'prop-types'
import { PanelCard, PanelCardHeader } from '@components/PanelShell'

const panelHeader = () => (
  <PanelCardHeader
    title="Verify your email"
    appIcon="https://browser.blockstack.org/images/app-icon-dotpodcast-256x256.png"
  />
)

const Verify = ({ email, resend, ...rest }) => (
  <PanelCard renderHeader={panelHeader} {...rest}>
    <PanelCard.Section pt={4} center>
      <p>
        We sent an email to <strong>{email}</strong> for verification. Please
        check your inbox to continue setting up your account.
      </p>
    </PanelCard.Section>
    <PanelCard.Section pt={2} center>
      <p>
        If you can't find the email, please check your spam or{' '}
        <a onClick={resend}>resend verification email.</a>
      </p>
    </PanelCard.Section>
  </PanelCard>
)

Verify.propTypes = {
  email: PropTypes.string,
  resend: PropTypes.func
}

export default Verify
