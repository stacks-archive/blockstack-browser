import React from 'react'
import { Type, Box } from 'blockstack-ui'
import PropTypes from 'prop-types'
import { browserHistory } from 'react-router'

import { Button } from '../../components/ui/containers/button'
import { connect, mapStateToProps } from './_helper'

const Registered = ({ username }) => (
  <Box width={1} textAlign="center">
    <Box width={[1, 4 / 5]} mx="auto">
      <Type>Welcome, {username}.id.blockstack!</Type>
      <Type fontSize={5} fontWeight="600" mt={4}>
        Blockstack has registered your new ID by propagating a transaction
        across the globe on the Stacks Blockchain
      </Type>

      <Button mt={6} maxWidth="300px" mx="auto" onClick={() => browserHistory.push('/hawk/key')}>
        Continue
      </Button>
    </Box>
  </Box>
)

Registered.propTypes = {
  username: PropTypes.string.isRequired
}

export default connect(mapStateToProps)(Registered)
