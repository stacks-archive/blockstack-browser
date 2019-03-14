import React, { useState } from 'react'
import { Type, Box } from 'blockstack-ui'
import PropTypes from 'prop-types'
import { browserHistory } from 'react-router'

import { Button } from '../../components/ui/containers/button'
import { Field } from '../../components/ui/containers/field'
import { connect, mapStateToProps } from './_helper'

const KeyConfirm = () => (
  <Box width={1} textAlign="center">
    <Box width={[1, 4 / 5]} mx="auto">
      <Type fontSize={5} fontWeight="600">
        Just to be safe, let's make sure you stored it correctly
      </Type>

      <Type fontSize={3} mt={4}>
        Enter the second and eighth words in your Secret Recovery Key:
      </Type>

      <Button
        mt={6}
        maxWidth="300px"
        mx="auto"
        onClick={() => browserHistory.push('/hawk/key')}
      >
        Continue
      </Button>
    </Box>
  </Box>
)

KeyConfirm.propTypes = {
  username: PropTypes.string.isRequired
}

export default connect(mapStateToProps)(KeyConfirm)
