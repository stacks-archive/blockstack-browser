import React from 'react'
import { theme, Flex, Box, Type } from '../../src'

const ColorComponent = ({ name = 'blue', ...props }) => {
  const blueColors = Object.values(theme.colors).map((blue) => [
    ...Object.values(blue).filter((c) => c.length > 1),
    String(blue)
  ])[0]
  const names = [
    ...Object.keys(theme.colors[name]).filter((c) => c.length > 1),
    name
  ]
  return (
    <Flex alignItems="flex-start" justifyContent="flex-start">
      {blueColors.map((color, i) => (
        <Box>
          <Box bg={color} size={100} />
          <Type
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {names[i]}
          </Type>
        </Box>
      ))}
    </Flex>
  )
}

export { ColorComponent }
