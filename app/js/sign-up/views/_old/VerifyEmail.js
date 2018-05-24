import React from 'react'
import PropTypes from 'prop-types'
import { PanelCard, PanelCardHeader } from '@components/PanelShell'

const panelHeader = () => (
  <PanelCardHeader
    h5="Check your email for our verification email."
    h2="Verify Your Email"
    mdi={'AtIcon'}
    pt={0}
  />
)

const Verify = ({ email, resend, next, ...rest }) => (
  <PanelCard renderHeader={panelHeader} {...rest} onClick={() => next()}>
    <PanelCard.Section left>
      <p>
        We sent an email to <strong>{email}</strong> to confirm delivery. Please
        check your inbox and follow the link to continue.
      </p>
      <p>
        If you can't find the email, please check your spam or{' '}
        <a href="#" onClick={resend}>
          resend verification email.
        </a>
      </p>
    </PanelCard.Section>
  </PanelCard>
)

Verify.propTypes = {
  email: PropTypes.string,
  resend: PropTypes.func,
  next: PropTypes.func
}

export default Verify
