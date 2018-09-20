import styled, { css } from 'styled-components'
import { trans } from '@ui/common'
import { spacing } from '@ui/common/constants'
import { Link } from 'react-router'
import { darken } from 'polished'
import {Flex} from '@components/ui/components/primitives'

const Label = styled.div`
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  font-size: 16px;
  text-align: center;
  ${trans};
  user-select: none;
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none !important;
`

const Section = styled.div`
  display: flex;
  align-items: center;
  overflow: hidden;
  flex-shrink: 0;
  p, h1, h2, h3, span{
  margin: 0 !important;
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 100%;
  color: rgba(255,255,255,0.5);
  }
  
    ${({ padding }) =>
      padding &&
      css`
        padding: ${padding};
      `};    

${({ maxWidth }) =>
  maxWidth &&
  css`
    max-width: ${maxWidth};
  `};
    
      ${({ column }) =>
        column &&
        css`
          flex-direction: column;
        `};

  ${({ justify }) =>
    justify &&
    css`
      justify-content: ${justify};
    `};
    ${({ align }) =>
      align &&
      css`
        align-items: ${align};
      `};
  }
    

  ${({ grow }) =>
    grow &&
    css`
      flex-grow: 1;
    `};
`

const IconWrapper = styled.div`
  position: relative;
  z-index: 10;
  svg {
    transform: translateX(5px);
    display: block;
  }
`

const StyledButton = styled(Flex)`
  ${({ height }) =>
    height &&
    css`
      border-radius: ${height}px;
      min-height: ${height}px;

      ${Section} {
        min-height: ${height}px;
      }
    `};

  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transform: translate3d(0, 0, 0);

  ${({ padding }) =>
    padding
      ? css`
          padding: ${padding};
        `
      : css`
          padding: 12px 30px;
        `};
  transition: 0.15s ease-in-out;

  &:hover {
    cursor: pointer;
  }

  &::before,
  &::after {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 48px;
    content: '';
    pointer-events: none;
    opacity: 0;
    transition: 0.1s all ease-in-out;
  }

  ${({ disabled }) =>
    disabled &&
    css`
      pointer-events: none;
      ${Label} {
        opacity: 0.5;
      }
    `};

  ${({ loading }) =>
    loading &&
    css`
      pointer-events: none;
    `};

  ${({ textOnly }) =>
    textOnly &&
    css`
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-grow: 1;
      flex-shrink: 0;
      padding: 0;
      ${Label} {
        color: rgba(39, 15, 52, 0.7);
        text-align: left !important;
        align-items: center;
        justify-content: flex-start;
        font-size: 14px;
        &:hover {
          color: rgba(39, 15, 52, 1);
        }
      }
    `};

  ${({ primary, textOnly, negative, filled }) =>
    !primary &&
    !textOnly &&
    css`
      border: 2px solid rgba(39, 16, 51, 0.4);
      ${Label} {
        color: rgba(39, 15, 52, 0.8);
        ${negative &&
          css`
            color: #f67b7b;
          `};
        ${filled &&
          css`
            color: white;
          `};
      }
      ${negative &&
        css`
          border-color: #f67b7b !important;
          * {
            font-weight: 600 !important;
          }
        `};

      ${filled &&
        css`
          background-color: #9282ae;
          border-color: #9282ae;
        `};
      &:active {
        border-color: rgba(39, 16, 51, 0.6);
        ${Label} {
          color: rgba(39, 15, 52, 1);
          ${negative &&
            css`
              color: #f67b7b;
            `};
        }
      }
    `};

  &:focus {
    box-shadow: inset 0 0 0 3px rgba(75, 190, 190, 1);
    &:before {
      box-shadow: inset 0 0 0 3px rgba(75, 190, 190, 1);
    }
  }

  ${({ primary }) =>
    primary &&
    css`
      border: 0 !important;
      background: linear-gradient(97.35deg, #382c68 0%, #7858a2 173.24%);
      box-shadow: 1px 3px 11px rgba(89, 58, 121, 0.28);
      ${Label} {
        color: #ffffff;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
      }
      &::before {
        background: linear-gradient(109.46deg, #504482 0%, #8c66bd 171.9%);
      }
      &:after {
        background: linear-gradient(109.46deg, #1d1740 0%, #664b8a 171.9%);
      }
      &:hover,
      &:focus {
        box-shadow: 1px 3px 11px rgba(89, 58, 121, 0.5);

        &::before {
          opacity: 1;
        }
      }

      &:active {
        box-shadow: 1px 1px 4px rgba(89, 58, 121, 0.32);
        transform: translateY(2px);
        &:after {
          background: linear-gradient(109.46deg, #1d1740 0%, #664b8a 171.9%);
          opacity: 1;
        }
      }
    `};
`

StyledButton.Div = StyledButton.withComponent('div')
StyledButton.Link = StyledButton.withComponent(Link)

const Buttons = styled(Flex)`
  ${({ overflow }) =>
    overflow &&
    css`
      overflow-y: auto;
      max-height: 100%;
      flex-grow: 1;
      background: ${darken(0.025, 'whitesmoke')};
      border-radius: 10px;
      padding: 20px 10px;
      &::-webkit-scrollbar {
        width: 10px;
      }

      &::-webkit-scrollbar-track {
        -webkit-box-shadow: none;
        background: ${darken(0.025, 'whitesmoke')};
        border-radius: 10px;
      }

      &::-webkit-scrollbar-thumb {
        background-color: darkgrey;
        outline: 1px solid slategrey;
        border-radius: 10px;
      }
    `};
  * {
    text-decoration: none !important;
  }
  &:first-of-type {
    margin-top: ${spacing.gutter};
  }
  &:not(:first-of-type) {
    margin-top: 15px;
  }
  ${({ split }) =>
    split
      ? css`
          display: flex;
          justify-content: space-between;
          align-items: center;
          ${StyledButton} + ${StyledButton},
            ${StyledButton} + ${StyledButton.Div},
            ${StyledButton} + ${StyledButton.Link},
            ${StyledButton.Link} + ${StyledButton.Link},
            ${StyledButton.Link} + ${StyledButton.Div},
            ${StyledButton.Link} + ${StyledButton},
            ${StyledButton.Div} + ${StyledButton},
            ${StyledButton.Div} + ${StyledButton.Link},
            ${StyledButton.Div} + ${StyledButton.Div} {
            margin-left: 15px;
          }

          ${StyledButton}:not (: last-of-type),
            ${StyledButton.Link}:not(:last-of-type),
            ${StyledButton.Div}:not(:last-of-type) {
            margin-right: 15px;
          }
        `
      : css`
          ${StyledButton} + ${StyledButton},
            ${StyledButton} + ${StyledButton.Div},
            ${StyledButton} + ${StyledButton.Link},
            ${StyledButton.Link} + ${StyledButton.Link},
            ${StyledButton.Link} + ${StyledButton.Div},
            ${StyledButton.Link} + ${StyledButton},
            ${StyledButton.Div} + ${StyledButton},
            ${StyledButton.Div} + ${StyledButton.Link},
            ${StyledButton.Div} + ${StyledButton.Div} {
            margin-top: 15px;
          }
        `};

  ${({ wrap }) =>
    wrap &&
    css`
      display: flex;
      align-items: flex-start;
      justify-content: flex-start;
      flex-wrap: wrap;
      ${StyledButton}, ${StyledButton.Div} {
        margin-top: 0 !important;
        padding: 10px 15px;
        margin-bottom: 15px;
        margin-right: 15px;
        border-width: 1px;
        margin-left: 0 !important;
      }
    `};

  ${({ column }) =>
    !column &&
    css`
      @media (min-width: 800px) {
        //display: flex;
        //justify-content: flex-start;
        //align-items: center;
        ${StyledButton}, ${StyledButton.Div} {
          white-space: nowrap;
        }
        ${StyledButton} + ${StyledButton},
          ${StyledButton} + ${StyledButton.Div},
          ${StyledButton} + ${StyledButton.Link},
          ${StyledButton.Link} + ${StyledButton.Link},
          ${StyledButton.Link} + ${StyledButton.Div},
          ${StyledButton.Link} + ${StyledButton},
          ${StyledButton.Div} + ${StyledButton},
          ${StyledButton.Div} + ${StyledButton.Link},
          ${StyledButton.Div} + ${StyledButton.Div} {
        }
      }
    `};
`

StyledButton.Label = Label
StyledButton.Icon = IconWrapper
StyledButton.Section = Section

export { StyledButton, Buttons }
