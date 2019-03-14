import React from 'react'
import PropTypes from 'prop-types'
import { Flex, Box } from 'blockstack-ui'
import App from '../App'

const Hawk = ({ children }) => (
  <App>
    <Flex px={[3, 5]} flexWrap="wrap">
      <Box width={1}>
        {children}
      </Box>
    </Flex>
  </App>
)

Hawk.propTypes = {
  children: PropTypes.node.isRequired
}

export default Hawk
