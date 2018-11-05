/**
 * Gaia Hub selection page
 *
 */
import React from 'react'
import { ShellScreen, Type } from '@blockstack/ui'
import Yup from 'yup'
import PropTypes from 'prop-types'
import { Flex } from '@components/ui/components/primitives'

const validationSchema = Yup.object({
  email: Yup.string()
    .required('A Gaia Hub URL is required.')
})

class GaiaView extends React.Component {
  state = {
    field: 'hubURL'
  }

  render() {
    const { hubURL, updateValue, next, loading, customHub, ...rest } = this.props

    const props = {
      content: {
        grow: 1,
        children: (
          <Flex
            style={{ flexGrow: 1 }}
            justifyContent="center"
            flexDirection="column"
          >
            <Type.h1 pb={3}>Choose a Gaia Hub</Type.h1>
            <Type.p>
              Gaia is a decentralized storage system that gives you control over your data. Your choice determines where your app data will be stored. The default Blockstack Gaia Hub is hosted by Blockstack PBC.
            </Type.p>
          </Flex>
        )
      },
      actions: {
        items: [
          {
            label: 'Use the Blockstack Gaia Hub',
            onClick: () => next(),
            primary: true,
            loading
          },
          {
            label: 'Use a custom Gaia Hub',
            onClick: () => {
              if (!loading) {
                customHub()
              } 
            },
            disabled: loading
          }
        ]
      }
    }
    return <ShellScreen {...rest} {...props} />
  }
}
GaiaView.propTypes = {
  loading: PropTypes.bool,
  next: PropTypes.func
}
export default GaiaView
