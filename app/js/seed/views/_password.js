import React from 'react'
import { ShellScreen } from '@blockstack/ui'
import Yup from 'yup'
import PropTypes from 'prop-types'

const validationSchema = Yup.object({
  password: Yup.string()
    .min(8, 'Your password is too short.')
    .required('A passsword is required.')
})

const PasswordView = ({ next, loading, placeholder, ...rest }) => {
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
            autoFocus: true,
            message:
              'The password you entered when you created this Blockstack ID.'
          }
        ],
        actions: {
          split: true,
          items: [
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

PasswordView.propTypes = {
  next: PropTypes.func,
  loading: PropTypes.bool,
  placeholder: PropTypes.node
}
export default PasswordView
