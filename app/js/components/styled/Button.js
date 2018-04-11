import React from 'react'
import { color, space } from 'styled-system'
import styled, { css } from 'styled-components'
import { colors } from '@components/styled/theme'
import { darken } from 'polished'

const buttonTypes = ({ primary, secondary, invert, small }) => {
  if (primary) {
    return css`
      color: #ffffff;
      border: 1px solid #2c96ff;
      background-color: #2c96ff;
      ${invert &&
        css`
          color: #2c96ff;
          border: 1px solid #ffffff;
          background-color: #ffffff;
        `};
      box-shadow: 4px 2px 10px rgba(44, 150, 255, 0.4);

      ${small &&
        css`
          padding: 5px;
          font-size: 12px;
        `};
    `
  }
  if (secondary) {
    return css`
      color: ${colors.grey[4]};
      border: 1px solid ${darken(0.09, colors.grey[1])};
      background-color: transparent;
      ${invert &&
        css`
          color: #ffffff;
          border: 1px solid #ffffff;
          background-color: transparent;
        `};
      ${small &&
        css`
          padding: 0;
          border: none;
          font-size: 12px;
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
  border-radius: 10px;
  user-select: none;
  transition: all 0.2s ease-in-out;
  width: 100%;

  ${buttonTypes};
  &:not(:first-of-type) {
    margin-top: 20px;
  }
`

const ButtonLink = Button.withComponent('a')

const Buttons = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
    ${space};

  ${Button}, ${ButtonLink}{
    margin-bottom: 0;
    width: auto;
  }
  ${Button} + ${Button},
  ${ButtonLink} + ${ButtonLink},
  ${ButtonLink} + ${Button},
  ${Button} + ${ButtonLink}{
    margin-top: 0;
  }
        ${({ center }) =>
          center &&
          css`
            justify-content: center;
          `};
  
`

export { Button, ButtonLink, Buttons }
