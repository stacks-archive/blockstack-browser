import React from 'react'
import {
  Type,
  Box,
  Flex,
  Inline,
  Button,
  Buttons,
  Card,
  Icons,
  Input,
  Textarea,
  theme
} from '../../src'
import { Codeblock } from './codeblock'
import styled from 'styled-components'
import { LiveProvider, LivePreview, LiveEditor, LiveError } from 'react-live'
import tag from 'clean-tag'
const code = (props) => {
  const isLive = props.className.includes('language-.jsx')
  const isNotInline = !props.className.includes('language')
  if (isNotInline) return <pre {...props} />
  if (!isLive) return <Codeblock {...props} />
  const code = React.Children.toArray(props.children).join('')

  return (
    <LiveProvider
      code={code}
      scope={{
        Type,
        Box,
        Flex,
        Inline,
        Button,
        Buttons,
        Card,
        Icons,
        Input,
        Textarea,
        tag,
        styled,
        ...Icons
      }}
    >
      <Card p={5} bg={'blue.light'} overflow={'hidden'}>
        <Box pb={5}>
          <LivePreview />
        </Box>
        <Box bg={'blue.dark'} overflow="hidden" borderRadius={5}>
          <Codeblock className="language-jsx">{code}</Codeblock>
        </Box>
        <LiveError />
      </Card>
    </LiveProvider>
  )
}

export { code }
