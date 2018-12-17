/**
 * Gaia Hub selection page
 *
 */
import React from 'react'
import { ShellScreen, Type } from '@blockstack/ui'
import Yup from 'yup'
import PropTypes from 'prop-types'
import { Flex } from '@components/ui/components/primitives'
import StyledOnboarding from '@components/styled/onboarding'

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
            <Type.h1 pb={3}>Where would you like to store your data?</Type.h1>
            <Type.p>
              Blockstack empowers you to own your data by choosing the storage provider of your choice.
            </Type.p>
            <Type.p>
              All apps you use with your Blockstack ID will store your data with that provider instead of their own servers.
            </Type.p>
            <StyledOnboarding.Hr />
            <Type.p>
              Would you like to use Blockstack's official provider or a different one?
            </Type.p>
            <Type.p>
              <Type.a href="https://github.com/blockstack/gaia" target="_blank">
                Learn more about storage with Blockstack
              </Type.a>
            </Type.p>
            {this.props.customHubError && (
              <Type.p color="red">
                {this.props.customHubError}
              </Type.p>
            )}
          </Flex>
        )
      },
      actions: {
        items: [
          {
            label: 'Use Blockstack\'s official provider',
            onClick: () => next(),
            primary: true,
            loading
          },
          {
            label: 'Use different provider',
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
  next: PropTypes.func,
  customHubError: PropTypes.string
}
export default GaiaView
