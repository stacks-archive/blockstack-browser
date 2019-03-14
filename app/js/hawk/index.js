import React from 'react'
import { Flex, Box } from 'blockstack-ui'
import App from '../App'

const Hawk = () => (
  <App>
    <Flex px={[3, 5]} flexWrap="wrap">
      <Box width={1}>
        {this.props.children}
      </Box>
    </Flex>
  </App>
)

export default Hawk
