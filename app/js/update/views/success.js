import React from 'react'
import { ShellScreen, Type } from '@blockstack/ui'
import PropTypes from 'prop-types'

class Success extends React.Component {
  componentDidMount() {
    setTimeout(() => this.props.goToBlockstack(), 8000)
  }

  render() {
    const { goToBlockstack, ...rest } = this.props

    const props = {
      title: {
        children: 'All done!',
        variant: 'h2'
      },
      content: {
        grow: 1,
        children: (
          <React.Fragment>
            <Type.p>
              You have successfully updated the latest version of the Blockstack
              browser. You will be redirected shortly.
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

Success.propTypes = {
  goToBlockstack: PropTypes.func.isRequired,
  app: PropTypes.object
}

export default Success
