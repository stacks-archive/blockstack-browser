import React from 'react'
import { ShellScreen } from '@blockstack/ui'
import Yup from 'yup'

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Your email address seems invalid.')
    .required('A recovery email is required.')
})

class EmailView extends React.Component {
  state = {
    field: 'email'
  }

  toggleField = ({ field }) =>
    field === 'email'
      ? this.setState({ field: 'phone' })
      : this.setState({ field: 'email' })

  returnField = ({ field }) =>
    field === 'email'
      ? [
          {
            type: 'email',
            name: 'email',
            label: 'Email Address',
            message: 'Your email is needed for critical recovery instructions.',
            autoFocus: true
          }
        ]
      : [
          {
            type: 'tel',
            name: 'phone',
            label: 'Mobile Number',
            message:
              'Your mobile number is needed for critical recovery instructions.',
            autoFocus: true
          }
        ]

  render() {
    const { email, updateValue, next, ...rest } = this.props

    const props = {
      headerLabel: 'Create your Blockstack ID',
      title: {
        children:
          this.state.field === 'email'
            ? 'What is your email address?'
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
                label:
                  this.state.field === 'email'
                    ? 'Use mobile number'
                    : 'Use email address',
                textOnly: true,
                onClick: () => this.toggleField(this.state)
              },
              {
                label: 'Next',
                primary: true,
                type: 'submit',
                icon: 'ArrowRightIcon'
              }
            ]
          }
        }
      },
      actions: {
        items: [
          {
            label: 'Restore a Blockstack ID',
            to: '/sign-in'
          }
        ]
      }
    }
    return <ShellScreen {...rest} {...props} />
  }
}

export default EmailView
