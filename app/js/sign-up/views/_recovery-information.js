/**
 * Recovery information failed
 *
 * This screen is only shown if the emails we are sending failed to send.
 */
import React from 'react'
import { ShellScreen, Type, Shell } from '@blockstack/ui'
import PropTypes from 'prop-types'
class RecoverInformationScreen extends React.Component {
  render() {
    const {
      next,
      email,
      emailsSending,
      recoveryEmailErrorCount,
      ...rest
    } = this.props

    const title = 'Recovery email failed to send'
    const body =
      recoveryEmailErrorCount > 1 ? (
        <>
          <Type.p>
            We tried to send recovery info to {email} but something went wrong.
            You must manually save your Secret Recovery Key.
          </Type.p>
        </>
      ) : (
        <>
          <Type.p>
            We tried to send recovery info to {email} but something went wrong.
            You can{' '}
            <Type.a onClick={() => this.props.backView()}>
              try to resend the email
            </Type.a>
            , or manually save your Secret Recovery Key.
          </Type.p>
        </>
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
            label: 'Secret Recovery Key',
            onClick: () => next(),
            primary: true
          }
        ]
      }
    }
    return (
      <>
        {emailsSending && (
          <Shell.Loading message="Resending recovery email..." />
        )}
        <ShellScreen {...rest} {...props} />
      </>
    )
  }
}

RecoverInformationScreen.propTypes = {
  next: PropTypes.func.isRequired,
  toggleConsent: PropTypes.func.isRequired,
  email: PropTypes.string.isRequired,
  recoveryEmailErrorCount: PropTypes.number.isRequired,
  restoreEmailError: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Error)
  ]),
  emailsSending: PropTypes.bool,
  sendRestoreEmail: PropTypes.func.isRequired
}

export default RecoverInformationScreen
