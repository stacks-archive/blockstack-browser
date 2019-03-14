import React from 'react'
import { Type, Box, Flex } from 'blockstack-ui'
import PropTypes from 'prop-types'
import { browserHistory } from 'react-router'

import { Button } from '../../components/ui/containers/button'
import { connect, mapStateToProps } from './_helper'

const Key = ({ username }) => (
  <Box width={1} textAlign="center">
    <Box width={[1, 4 / 5]} mx="auto">
      <Type fontSize={5} fontWeight="600">
        Now let's save the key for your new digital home!
      </Type>

      <Flex flexWrap="wrap" flexDirection="row" textAlign="left" mt={5}>
        <Box width={[1, 1 / 2]} pr={4}>
          <Type fontSize={3}>
            Your new Blockstack ID ({username}.id.blockstack) is so secure that
            it needs more than a password: it needs a{' '}
            <em>Secret Recovery Key</em>.
            <br />
            <br />
            This Secret Recovery Key is a
            pre-generated 12-word combination that you must store somewhere
            safely forever. 
            <br />
            <br />
            Don’t show it to anyone, don’t store it anywhere
            unsafe and above all, don’t lose it! If you do, you’ll be locked out
            of your ID forever – not even we at Blockstack can recover it for
            you.
          </Type>
        </Box>
        <Box width={[1, 1 / 2]}>
          <Box width={1} p={4} border="1px solid gray" borderRadius="4px">
            alpha beta charlie delta echo foxtrot golf hotel india juliet kilo lima
          </Box>
          <Button
            mt={4}
            mx="auto"
            onClick={() => browserHistory.push('/hawk/key-confirm')}
          >
            I've saved it somewhere securely
          </Button>
        </Box>
      </Flex>
    </Box>
  </Box>
)

Key.propTypes = {
  username: PropTypes.string.isRequired
}

export default connect(mapStateToProps)(Key)
