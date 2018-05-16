import React from 'react'
import { ShellScreen, Type } from '@blockstack/ui'
import Yup from 'yup'

const validationSchema = Yup.object({
  recoveryKey: Yup.string()
    .min(8, 'Your key is too short.')
    .required('This is required.')
})
export default ({ next, ...rest }) => {
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
            label: 'Magic Recovery Code or Secret Recovery Key',
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
            Scan or copy/paste your Magic Recovery Code (we sent it to you when
            you created your ID) or Secret Recovery Key (those 12 words you
            recorded).
          </Type.p>
          <Type.p>
            You’ll also need your password (the password you entered when the
            Magic Recovery Code was created).
          </Type.p>
        </React.Fragment>
      )
    }
  }
  return <ShellScreen {...rest} {...props} />
}
