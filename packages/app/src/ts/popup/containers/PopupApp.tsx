import React from 'react'
import { ThemeProvider, theme, CSSReset, Flex, Box, Text } from '@blockstack/ui'
import { hot } from 'react-hot-loader/root'
import Gutter from '@components/gutter'

const PopupApp: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <React.Fragment>
        <CSSReset />
        <Flex>
          <Box width="100%" textAlign="center" px={5}>
            <Gutter multiplier={3} />
            <Text textStyle="display.large">Welcome to the Blockstack App!</Text>
          </Box>
        </Flex>
      </React.Fragment>
    </ThemeProvider>
  )
}

export default hot(PopupApp)
