import React from 'react'
import { Flex, Box, Type } from 'blockstack-ui'
import ArrowBackIcon from 'mdi-react/ArrowBackIcon'

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
    view: VIEWS.INITIAL,
    username: ''
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
      {
        username: this.state.username,
        updateUsername: (evt) => this.setState({ username: evt.target.value })
      }
    ]
    const currentViewProps = viewProps[view]
    const View = views[view]
    return (
      <App>
        <Flex px={[3, 5]} flexWrap="wrap">
          <Box width={1} style={{ cursor: 'pointer' }}>
            {view > 0 && (
              <Box mb={3} onClick={() => this.updateView(view - 1)}>
                <ArrowBackIcon />
                <Type ml={2} color="light" fontSize={3} style={{ position: 'relative', top: '-4px' }}>Back</Type>
              </Box>
            )}
          </Box>
          <Box width={1}>
            <View {...currentViewProps} />
          </Box>
        </Flex>
      </App>
    )
  }
}

export default Hawk
