import React from 'react'
import { Type, Box } from 'blockstack-ui'
import { browserHistory } from 'react-router'

import { Button } from '../../components/ui/containers/button'

const Initial = () => (
  <Box width={1} textAlign="center">
    <Box width={[1, 4 / 5]} mx="auto">
      <Type fontSize={6} fontWeight="600" display="block">
        Secure your digital freedom on the world's most advanced blockchain with
        Blockstack
      </Type>
      <Type fontSize={3} color="grey" mt={4}>
        The future of independence is here. Take back control over your identity
        and personal data from governments and corporations, and start using
        hundrends of applications with unfettered liberty. 
        <br />
        <br />
        It takes just 5
        minutes – and it’s 100% free!
      </Type>
      <Button
        onClick={() => browserHistory.push({ pathname: '/hawk/name' })}
        mt={4}
        type="primary"
        maxWidth="300px"
        mx="auto"
      >
        Let's do it!
      </Button>
    </Box>
  </Box>
)

export default Initial
