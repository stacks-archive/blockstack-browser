import React from 'react'
import { ShellScreen, Type } from '@blockstack/ui'
import PropTypes from 'prop-types'

class NoUpdate extends React.Component {
  componentDidMount() {
    setTimeout(() => this.props.goToBlockstack(), 3000)
  }

  render() {
    const { goToBlockstack, ...rest } = this.props

    const props = {
      title: {
        children: 'You are up-to-date.',
        variant: 'h2'
      },
      content: {
        grow: 1,
        children: (
          <React.Fragment>
            <Type.p>
              You are running the latest version of the Blockstack browser,
              there's nothing to update! You will be redirected shortly.
            </Type.p>
          </React.Fragment>
        )
      },
      actions: {
        items: [
          {
            label: <React.Fragment>Go to Blockstack</React.Fragment>,
            primary: true,
            onClick: () => goToBlockstack()
          }
        ]
      }
    }
    return <ShellScreen {...rest} {...props} />
  }
}

NoUpdate.propTypes = {
  goToBlockstack: PropTypes.func.isRequired,
  app: PropTypes.object
}

export default NoUpdate
