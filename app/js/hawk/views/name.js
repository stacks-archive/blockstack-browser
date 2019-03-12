import React from 'react'
import { Type, Box } from 'blockstack-ui'

import { Field } from '@ui/containers/field'
import { Button } from '@ui/containers/button'

export default () => (
  <Box>
    <Type fontSize={4} display="block">
      Create your Blockstack ID
    </Type>
    <Type fontSize={2} color="grey" mt={4}>
      Blockstack is great. Lorem ipsum
      <br />
      dolorest est.
    </Type>

    <Field mt={4} placeholder="Your Blockstack ID" value="asdf" label="Blockstack ID" />

    <Button mt={4}>
      Continue
    </Button>
    
  </Box>
)
