import React from 'react'
import { ShellScreen } from '@blockstack/ui'
import Yup from 'yup'

const validationSchema = Yup.object({
  password: Yup.string()
    .min(8, 'Your password is too short.')
    .required('A passsword is required.'),
  passwordConfirm: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords do not match.')
    .required('Please confirm your password.')
})

class PasswordView extends React.Component {
  render() {
    const { updateValue, next, loading, ...rest } = this.props

    const props = {
      title: {
        children: 'Create a password',
        variant: 'h2'
      },
      content: {
        grow: 0,
        form: {
          validationSchema,
          initialValues: { password: '', passwordConfirm: '' },
          onSubmit: values => {
            updateValue('password', values.password)
            next()
          },
          fields: [
            {
              type: 'password',
              name: 'password',
              label: 'Password',
              autoFocus: true
            },
            {
              type: 'password',
              name: 'passwordConfirm',
              label: 'Confirm Password',
              message: 'Minimum 8 characters.'
            }
          ],
          actions: {
            split: true,
            items: [
              {
                label: ' ',
                textOnly: true
              },
              {
                label: 'Next',
                primary: true,
                type: 'submit',
                icon: 'ArrowRightIcon',
                loading
              }
            ]
          }
        }
      }
    }
    return <ShellScreen {...rest} {...props} />
  }
}
export default PasswordView
