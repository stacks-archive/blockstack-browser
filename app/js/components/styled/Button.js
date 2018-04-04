import React from 'react'
import { space, color } from 'styled-system'
import styled, { css } from 'styled-components'
import { colors } from '@components/styled/theme'

const buttonTypes = ({ primary, secondary, invert }) => {
  if (primary) {
    return css`
      color: #fff;
      border: 1px solid #2c96ff;
      background-color: #2c96ff;
      ${invert &&
        css`
          color: #2c96ff;
          border: 1px solid #ffffff;
          background-color: #ffffff;
        `};
    `
  }
  if (secondary) {
    return css`
      color: ${colors.grey[4]};
      border: 1px solid ${colors.grey[1]};
      background-color: transparent;
      ${invert &&
        css`
          color: #ffffff;
          border: 1px solid #ffffff;
          background-color: transparent;
        `};
    `
  }
}

const Button = styled.button`
  ${space};
  ${color};
  font-family: 'Lato', sans-serif;
  padding: 0.75rem 2.5rem 0.6875rem 2.5rem;
  font-size: 1rem;
  font-weight: 900;
  line-height: 1.75rem;
  border-radius: 2px;
  user-select: none;
  transition: all 0.2s ease-in-out;
  width: 100%;
  ${buttonTypes};
  &:not(:first-of-type) {
    margin-top: 20px;
  }
`

const Buttons = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  ${Button}{
  margin-bottom: 0;
  width: auto;
  }
  ${Button} + ${Button}{
  margin-top: 0;
  }
`

export { Button, Buttons }
