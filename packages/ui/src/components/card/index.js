import React from 'react'
import { Flex } from '../../'

const Card = ({ children, ...rest }) => <Flex {...rest}>{children}</Flex>

Card.defaultProps = {
  border: 1,
  bg: 'white',
  p: 3,
  borderColor: 'blue.mid',
  borderRadius: 3,
  flexDirection: 'column',
  boxShadow: 'card'
}
export { Card }
