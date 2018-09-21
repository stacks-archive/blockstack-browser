import React from 'react'
import PropTypes from 'prop-types'
import { ShellScreen, Shell } from '@blockstack/ui'
import Yup from 'yup'

const validationSchema = Yup.object({
  password: Yup.string()
    .min(8, 'Your password is too short.')
    .required('A passsword is required.'),
  passwordConfirm: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords do not match.')
    .required('Please confirm your password.')
})

const PasswordView = ({ updateValue, next, loading, ...rest }) => {
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
            label: 'New password (8 characters min)',
            disabled: loading,
            autoFocus: true
          },
          {
            disabled: loading,
            type: 'password',
            name: 'passwordConfirm',
            label: 'Confirm Password',
            message:
              'Please record your password, Blockstack cannot reset this password for you.'
          }
        ],
        actions: {
          split: true,
          items: [
            {
              label: 'Next',
              primary: true,
              loading,
              disabled: loading,
              type: 'submit',
              icon: 'ArrowRightIcon'
            }
          ]
        }
      }
    }
  }
  return (
    <React.Fragment>
      {loading ? (
        <Shell.Loading message="Creating your Blockstack ID..." />
      ) : null}
      <ShellScreen {...rest} {...props} />
    </React.Fragment>
  )
}

PasswordView.propTypes = {
  updateValue: PropTypes.func,
  next: PropTypes.func,
  loading: PropTypes.bool
}
export default PasswordView
