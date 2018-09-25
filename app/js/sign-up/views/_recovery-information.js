/**
 * Recovery information failed
 *
 * This screen is only shown if the emails we are sending failed to send.
 */
import React from 'react'
import { ShellScreen, Type, Shell } from '@blockstack/ui'
import PropTypes from 'prop-types'
class RecoverInformationScreen extends React.Component {
  sendEmailAgain = () => {
    if (!this.props.emailsSending) {
      this.props.sendRestoreEmail()
    }
  }

  render() {
    const { next, email, emailsSending, ...rest } = this.props

      const title = 'Recovery email failed to send'
      const body = (
        <React.Fragment>
          <Type.p>
            We tried to send your <strong>Magic Recovery Code</strong> to{' '}
            {email} but something went wrong. You can{' '}
            <Type.a onClick={() => this.sendEmailAgain()}>
              try to resend it
            </Type.a>
            , or continue and back up your secret recovery key.
          </Type.p>
        </React.Fragment>
      )

    const props = {
      title: {
        children: title
      },
      content: {
        grow: 1,
        children: body
      },
      actions: {
        items: [
          {
            label: 'Continue',
            onClick: () => next(),
            primary: true
          }
        ]
      }
    }
    return (
      <React.Fragment>
        {emailsSending &&
          <Shell.Loading message="Resending recovery email..." />
        }
        <ShellScreen {...rest} {...props} />
      </React.Fragment>
    )
  }
}

RecoverInformationScreen.propTypes = {
  next: PropTypes.func.isRequired,
  toggleConsent: PropTypes.func.isRequired,
  email: PropTypes.string.isRequired,
  consent: PropTypes.bool.isRequired,
  restoreEmailError: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Error)
  ]),
  emailsSending: PropTypes.bool,
  sendRestoreEmail: PropTypes.func.isRequired
}

export default RecoverInformationScreen
