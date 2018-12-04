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

class RecommendedGaiaView extends React.Component {
  state = {
    field: 'hubURL'
  }

  render() {
    const { recommendedGaiaHubUrl, next, app, loading, customHub, defaultHub, ...rest } = this.props

    const props = {
      content: {
        grow: 1,
        children: (
          <Flex
            style={{ flexGrow: 1 }}
            justifyContent="center"
            flexDirection="column"
          >
            <Type.h1 pb={3}>{app.name} recommends you store your data with this provider:</Type.h1>
            <StyledOnboarding.RecommendedHubPlaceholder>
              {recommendedGaiaHubUrl}
            </StyledOnboarding.RecommendedHubPlaceholder>
            <Type.p>
              Blockstack empowers you to own your data by choosing the storage provider of your choice.
            </Type.p>
            <Type.p>
              Would you like to use the above provider, Blockstack's official provider, or a different one?
            </Type.p>
            <Type.p>
              <Type.a href="https://github.com/blockstack/gaia" target="_blank">
                Learn more about storage with Blockstack
              </Type.a>
            </Type.p>
          </Flex>
        )
      },
      actions: {
        items: [
          {
            label: 'Yes, use recommended provider',
            onClick: () => next(),
            primary: true,
            loading
          },
          {
            label: 'Use Blockstack\'s provider',
            onClick: () => defaultHub()
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
RecommendedGaiaView.propTypes = {
  loading: PropTypes.bool,
  next: PropTypes.func,
  app: PropTypes.object,
  recommendedGaiaHubUrl: PropTypes.string,
  customHub: PropTypes.func,
  defaultHub: PropTypes.func
}
export default RecommendedGaiaView
