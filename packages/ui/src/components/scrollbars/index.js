import React from 'react'
import styled from 'styled-components'
import { themeGet } from 'styled-system'
import { Box } from '../primitives'

const Scrollbars = styled(Box)`
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    border-radius: 8px;
    background: ${(props) => themeGet(`colors.${props.scrollbar}`)(props)};
  }
  &::-webkit-scrollbar-thumb {
    background: ${(props) => themeGet(`colors.${props.thumb}`)(props)};
    border-radius: 8px;
  }
  & > * {
    &::-webkit-scrollbar {
      width: 8px;
      height: 8px;
      border-radius: 8px;
      background: ${(props) => themeGet(`colors.${props.scrollbar}`)(props)};
    }
    &::-webkit-scrollbar-thumb {
      background: ${(props) => themeGet(`colors.${props.thumb}`)(props)};
      border-radius: 8px;
    }
  }
`

Scrollbars.defaultProps = {
  scrollbar: 'blue.light',
  thumb: 'blue.dark'
}

export { Scrollbars }
