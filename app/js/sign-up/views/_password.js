/**
 * Create a password
 *
 * This screen is the password input to encrypt the new user's seed phrase
 */
import React from 'react'
import PropTypes from 'prop-types'
import { ShellScreen, Type, Shell } from '@blockstack/ui'
import Yup from 'yup'

const validationSchema = Yup.object({
  password: Yup.string()
    .min(8, 'Too short. 8 characters minimum.')
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
      children: (
        <Type.small pt={3}>
          8 characters minimum. Please record your password, Blockstack cannot
          reset this password for you.
        </Type.small>
      ),
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
            label: 'New password  (8 characters min)',
            disabled: loading,
            autoFocus: true
          },
          {
            disabled: loading,
            type: 'password',
            name: 'passwordConfirm',
            label: 'Confirm Password'
          }
        ],
        actions: {
          split: true,
          items: [
            {
              label: 'Register ID',
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
    <>
      {loading ? (
        <Shell.Loading message="Creating your Blockstack ID..." />
      ) : null}
      <ShellScreen {...rest} {...props} />
    </>
  )
}

PasswordView.propTypes = {
  updateValue: PropTypes.func,
  next: PropTypes.func,
  loading: PropTypes.bool
}
export default PasswordView
