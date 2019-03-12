import React from 'react'
import { Type, Box } from 'blockstack-ui'
import PropTypes from 'prop-types'

import { Field } from '@ui/containers/field'
import { Button } from '@ui/containers/button'

const Name = ({ username, updateUsername }) => (
  <Box width={[1, 1, 1/3]}>
    <Type fontSize={4} display="block">
      Create your Blockstack ID
    </Type>
    <Type fontSize={2} color="grey" mt={4}>
      Blockstack is great. Lorem ipsum
      <br />
      dolorest est.
    </Type>

    <Field 
      mt={4}
      value={username} 
      handleChange={updateUsername} 
      label="Blockstack ID" 
      autoFocus
    />

    <Button mt={4}>
      Continue
    </Button>
    
  </Box>
)

Name.propTypes = {
  username: PropTypes.string.isRequired,
  updateUsername: PropTypes.func.isRequired
}

export default Name
