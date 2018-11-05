/**
 * Email / Backup ID page
 *
 * This screen is our current backup option (email)
 * This might change to other options outside of just email (eg phone, download, etc)
 */
import React from 'react'
import { ShellScreen, Type } from '@blockstack/ui'
import Yup from 'yup'
import PropTypes from 'prop-types'
import { Flex } from '@components/ui/components/primitives'

const validationSchema = Yup.object({
  hubURL: Yup.string()
    .required('A Gaia Hub URL is required.')
})

class CustomGaiaHub extends React.Component {
  state = {
    field: 'hubURL'
  }

  message = () => ''

  returnField = ({ field }) =>
    [
      {
        type: 'email',
        name: 'hubURL',
        autoFocus: true,
        label: 'Gaia Hub URL'
      }
    ]

  render() {
    const { hubURL, updateValue, next, loading, ...rest } = this.props

    const props = {
      title: {
        children: 'Enter custom Gaia hub URL',
        variant: 'h2'
      },
      content: {
        grow: 1,
        form: {
          validationSchema,
          validateOnBlur: false,
          initialValues: { hubURL },
          onSubmit: values => {
            updateValue('hubURL', values.hubURL)
            next()
          },
          fields: this.returnField(this.state),
          actions: {
            split: false,
            items: [
              {
                label: 'Continue',
                primary: true,
                type: 'submit',
                loading,
                disabled: loading
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
CustomGaiaHub.propTypes = {
  email: PropTypes.string,
  updateValue: PropTypes.func,
  loading: PropTypes.bool,
  next: PropTypes.func
}
export default CustomGaiaHub
