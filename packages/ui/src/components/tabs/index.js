import React from 'react'
import { Flex, Box } from '../primitives'
import { Type } from '../typography'

const Tab = ({ children, active = undefined, ...rest }) => (
  <Flex
    alignItems="center"
    justifyContent="center"
    py={3}
    px={4}
    active={active}
    {...rest}
  >
    <Type
      fontSize={1}
      fontWeight={400}
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
    >
      {children}
    </Type>
  </Flex>
)
