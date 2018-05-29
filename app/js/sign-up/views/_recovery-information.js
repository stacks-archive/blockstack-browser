import React from 'react'
import { ShellScreen, Type } from '@blockstack/ui'
import PropTypes from 'prop-types'

class RecoverInformationScreen extends React.Component {
  state = {
    resend: false
  }

  sendEmailAgain = () => {
    if (!this.state.resend) {
      this.setState(
        {
          resend: true
        },
        () => this.props.sendRecoveryEmail()
      )
    }
  }

  render() {
    const { next, email, ...rest } = this.props
    const props = {
      title: {
        children: 'We just sent you recovery information'
      },
      content: {
        grow: 1,
        children: (
          <React.Fragment>
            <Type.p>
              We sent your <strong>Magic Recovery Code</strong> to {email}.
              Please check your inbox to ensure you can recover this account.
            </Type.p>
            <Type.p>
              {!this.state.resend ? (
                <React.Fragment>
                  Can't find the email? Check your spam or{' '}
                  <Type.a onClick={() => this.sendEmailAgain()}>
                    resend the email
                  </Type.a>.
                </React.Fragment>
              ) : (
                'Email has been sent again!'
              )}
            </Type.p>
          </React.Fragment>
        )
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
    return <ShellScreen {...rest} {...props} />
  }
}

RecoverInformationScreen.propTypes = {
  next: PropTypes.func.isRequired,
  email: PropTypes.string.isRequired,
  sendRecoveryEmail: PropTypes.func.isRequired
}

export default RecoverInformationScreen
