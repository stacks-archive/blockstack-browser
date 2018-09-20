import React from 'react'
import { ShellScreen, Type, Shell } from '@blockstack/ui'
import PropTypes from 'prop-types'
import CheckboxBlankOutlineIcon from 'mdi-react/CheckboxBlankOutlineIcon'
import CheckboxMarkedOutlineIcon from 'mdi-react/CheckboxMarkedOutlineIcon'
class RecoverInformationScreen extends React.Component {
  sendEmailAgain = () => {
    if (!this.props.emailsSending) {
      this.props.sendRestoreEmail()
    }
  }

  render() {
    const { next, email, restoreEmailError, emailsSending, ...rest } = this.props
    let title
    let body

    if (restoreEmailError) {
      title = 'Recovery email failed to send'
      body = (
        <React.Fragment>
          <Type.p>
            We tried to send your <strong>Magic Recovery Code</strong> to{' '}
            {email} but something went wrong. You can{' '}
            <Type.a onClick={() => this.sendEmailAgain()}>
              try to resend it
            </Type.a>
            , or continue and back up your secret recovery key later.
          </Type.p>
        </React.Fragment>
      )
    } else  {
      title = 'We just sent you recovery information'
      body = (
        <React.Fragment>
          <Type.p>
            We sent your <strong>Magic Recovery Code</strong> to {email}.
            Please check your inbox to ensure you can recover this account.
          </Type.p>
          <Type.p>
            Can't find the email? Check your spam or{' '}
            <Type.a onClick={() => this.sendEmailAgain()}>
              resend the email
            </Type.a>.
          </Type.p>
          <Type.h3 padding="20px 0 10px 0">
            Would you like to subscribe to receive updates from Blockstack?
          </Type.h3>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer'
            }}
            onClick={() => this.props.toggleConsent()}
          >
            {this.props.consent ? (
              <CheckboxMarkedOutlineIcon color="#504482" />
            ) : (
              <CheckboxBlankOutlineIcon color="rgba(39, 16, 51, 0.4)" />
            )}
            <Type.p small padding="0 0 0 6px">
              Yes, add my email to the list.
            </Type.p>
          </div>
        </React.Fragment>
      )
    }


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
