import React from 'react'
import { ShellScreen, Type } from '@blockstack/ui'
import PropTypes from 'prop-types'
import Yup from 'yup'
import { validateMnemonic } from 'bip39'

const validationSchema = Yup.object({
  recoveryKey: Yup.string()
    .required('This is required.')
    .test('is-valid', 'That’s not a valid recovery key or code', value => {
      // Raw mnemonic phrase
      if (validateMnemonic(value)) {
        return true
      }
      // Base64 encoded encrypted phrase
      if (/[a-zA-Z0-9+/]=$/.test(value)) {
        return true
      }
      return false
    })
})
const InitialSignInScreen = ({ next, ...rest }) => {
  const props = {
    title: {
      children: 'Restore your Blockstack ID'
    },
    content: {
      grow: 1,
      form: {
        validationSchema,
        initialValues: { recoveryKey: '' },
        onSubmit: values => {
          next(values.recoveryKey)
        },
        fields: [
          {
            type: 'textarea',
            name: 'recoveryKey',
            label: 'Recovery Code/Key',
            mh: 100,
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
              label: 'Restore',
              primary: true,
              icon: 'ArrowRightIcon',
              type: 'submit'
            }
          ]
        }
      },
      children: (
        <React.Fragment>
          <Type.p>
            Enter your Magic Recovery Code (we sent it to you when you created your ID)
            or Secret Recovery Key (those 12 or 24 words you recorded).
          </Type.p>
        </React.Fragment>
      )
    },
    actions: {
      items: [
        {
          label: 'Create a new Blockstack ID',
          to: '/sign-up'
        }
      ]
    }
  }
  return <ShellScreen {...rest} {...props} />
}

InitialSignInScreen.propTypes = {
  next: PropTypes.func
}

export default InitialSignInScreen
