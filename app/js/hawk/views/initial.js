import React from 'react'
import { Type, Box } from 'blockstack-ui'
import PropTypes from 'prop-types'

import { Button } from '@ui/containers/button'

const Initial = ({ next }) => (
  <Box>
    <Type fontSize={4} display="block">Welcome to Blockstack</Type>
    <Type fontSize={2} color="grey" mt={4}>
      Blockstack is great. Lorem ipsum
      <br />
      dolorest est.
    </Type>
    <Button onClick={next} mt={4} type="primary" maxWidth="300px">
      Continue
    </Button>
  </Box>
)

Initial.propTypes = {
  next: PropTypes.func.isRequired
}

export default Initial
