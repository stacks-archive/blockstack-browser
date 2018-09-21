import React from 'react'
import { ShellScreen, Type } from '@blockstack/ui'
import Yup from 'yup'
import PropTypes from 'prop-types'
import { Box } from '@components/ui/components/primitives'

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
            label: 'Email Address'
          }
        ]
      : [
          {
            type: 'tel',
            name: 'phone',
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
  next: PropTypes.func
}
export default EmailView
