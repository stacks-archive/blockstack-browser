import React from 'react'
import { ShellScreen } from '@blockstack/ui'
import Yup from 'yup'

const validationSchema = Yup.object({
  password: Yup.string()
    .min(8, 'Your password is too short.')
    .required('A passsword is required.')
})

class PasswordView extends React.Component {
  render() {
    const { next, loading, placeholder, ...rest } = this.props

    const props = {
      title: {
        children: 'Enter your password',
        variant: 'h2'
      },
      content: {
        grow: 0,
        form: {
          validationSchema,
          initialValues: { password: '' },
          onSubmit: values => next(values.password),
          fields: [
            {
              type: 'password',
              name: 'password',
              label: 'Password',
              autoFocus: true
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
                disabled: loading,
                loading,
                placeholder
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
