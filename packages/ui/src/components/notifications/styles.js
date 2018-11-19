import React from 'react'
import styled from 'styled-components'
import { animated } from 'react-spring'
import { Flex } from '../primitives'
import { Hover } from 'react-powerplug'

export const Container = styled('div')`
  position: fixed;
  z-index: 1000;
  width: 0 auto;
  top: ${(props) => (props.top ? '30px' : 'unset')};
  bottom: ${(props) => (props.top ? 'unset' : '30px')};
  margin: 0 auto;
  right: 30px;
  display: flex;
  flex-direction: ${(props) => (props.top ? 'column-reverse' : 'column')};
  align-items: ${(props) =>
    props.position === 'center' ? 'center' : `flex-${props.position}`};
  @media (max-width: 680px) {
    align-items: center;
  }
`

export const Message = ({ ...rest }) => (
  <Flex
    is={animated.div}
    position={'relative'}
    overflow="hidden"
    width="40ch"
    fontSize={1}
    {...rest}
  />
)

export const Content = ({ top, canClose, ...rest }) => (
  <Flex
    display="grid"
    gridTemplateColumns={canClose ? '1fr auto' : '1fr'}
    gridGap="10px"
    overflow="hidden"
    border={1}
    borderColor="blue.mid"
    bg="white"
    color="blue.dark"
    pl={4}
    width={1}
    borderRadius={6}
    boxShadow="card"
    mt={top ? '10px' : 0}
    mb={top ? '0' : '10px'}
    {...rest}
  />
)

export const Button = ({ ...rest }) => (
  <Hover>
    {({ hovered, bind }) => (
      <Flex
        is="button"
        border="0"
        bg="transparent"
        color="blue.dark"
        opacity={hovered ? 1 : 0.5}
        cursor={hovered ? 'pointer' : 'unset'}
        position="relative"
        zIndex={9999}
        alignSelf="flex-start"
        p={4}
        style={{
          outline: 'none'
        }}
        {...rest}
        {...bind}
      />
    )}
  </Hover>
)
