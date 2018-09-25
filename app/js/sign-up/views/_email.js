/**
 * Email / Backup ID page
 *
 * This screen is our current backup option (email)
 * This might change to other options outside of just email (eg phone, download, etc)
 */
import React from 'react'
import { ShellScreen, Type } from '@blockstack/ui'
import Yup from 'yup'
import PropTypes from 'prop-types'

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Your email address seems invalid.')
    .required('A recovery email is required.')
})

class EmailView extends React.Component {
  state = {
    field: 'email'
  }

  message = () =>
    this.state.field === 'email'
      ? 'Your email is needed for backup and recovery options. We do not store this.'
      : 'Your mobile number is needed for backup and recovery options.'

  returnField = ({ field }) =>
    field === 'email'
      ? [
          {
            type: 'email',
            name: 'email',
            autoFocus: true,
            label: 'Email Address'
          }
        ]
      : [
          {
            type: 'tel',
            name: 'phone',
            autoFocus: true,
            label: 'Mobile Number'
          }
        ]

  render() {
    const { email, updateValue, next, loading, ...rest } = this.props

    const props = {
      title: {
        children:
          this.state.field === 'email'
            ? 'What is your email?'
            : 'What is your mobile number?',
        variant: 'h2'
      },
      content: {
        grow: 1,
        form: {
          validationSchema,
          validateOnBlur: false,
          initialValues: { email },
          onSubmit: values => {
            updateValue('email', values.email)
            next()
          },
          fields: this.returnField(this.state),
          actions: {
            split: true,
            items: [
              {
                label: 'Next',
                primary: true,
                type: 'submit',
                loading,
                disabled: loading,
                icon: 'ArrowRightIcon'
              }
            ]
          }
        },
        children: <Type.p>{this.message()}</Type.p>
      }
    }
    return <ShellScreen {...rest} {...props} />
  }
}
EmailView.propTypes = {
  email: PropTypes.string,
  updateValue: PropTypes.func,
  loading: PropTypes.bool,
  next: PropTypes.func
}
export default EmailView
