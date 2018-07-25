import React from 'react'
import { ShellScreen, Type } from '@blockstack/ui'
import PropTypes from 'prop-types'
import Yup from 'yup'

const validationSchema = Yup.object({
  recoveryKey: Yup.string()
    .min(8, 'Your key is too short.')
    .required('This is required.')
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
            Enter your Magic Recovery Code. This code was sent to you when you created your ID. Alternatively,
            you can supply your Secret Recovery Key. This key is a sequence of words you recorded, for example, "rabbit pink ..." 
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
