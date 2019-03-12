import React from 'react'
import { Flex, Box } from 'blockstack-ui'

import App from '../App'
import {
  Initial,
  Name
} from './views'

const views = [
  Initial,
  Name
]

const VIEWS = {
  INITIAL: 0,
  NAME: 1
}

class Hawk extends React.Component {
  state = {
    view: VIEWS.INITIAL
  }

  updateView(view) {
    this.setState({ view })
  }

  render() {
    const { view } = this.state
    console.log('current view', view)
    const viewProps = [
      {
        next: () => this.updateView(VIEWS.NAME)
      },
      {}
    ]
    const currentViewProps = viewProps[view]
    const View = views[view]
    return (
      <App>
        <Flex py={[1, 5]} px={[1, 5]}>
          <Box>
            <View {...currentViewProps} />
          </Box>
        </Flex>
      </App>
    )
  }
}

export default Hawk
