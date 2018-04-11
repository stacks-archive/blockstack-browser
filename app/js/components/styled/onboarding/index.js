import React from 'react'
import styled, { css } from 'styled-components'
import { darken } from 'polished'
import { color, lineHeight, space } from 'styled-system'
import { colors } from '@components/styled/theme'

const mobileCardWidth = 400

const Panel = styled.div`
  height: 100vh;
  width: 100%;
  position: fixed;
  left: 0;
  top: 0;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  ${space};
  ${color};
  z-index: 5;
  a {
    text-decoration: none !important;
  }
  @media (min-width: 800px) {
    padding: 20px;
    align-items: center;
    justify-content: center;
  }
`

const Card = styled.div`
  flex-grow: 1;
  flex-shrink: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  position: absolute;
  min-height: 100vh;
  top: 0;
  left: 0;
  ${space};
  ${color};
  background: rgba(0, 0, 0, 0.025);
  overflow: hidden;

  @media (min-width: 800px) {
    max-width: ${mobileCardWidth}px;
    margin-left: auto;
    margin-right: auto;
    box-shadow: 2px 4px 12px rgba(0, 0, 0, 0.05);
    left: calc(50% - ${mobileCardWidth / 2}px);
    border: 1px solid ${darken(0.05, colors.grey[1])};
    max-height: 80vh;
    top: 60px;
    min-height: 500px;
    border-radius: 4px;
  }
  ${({ showing }) =>
    !showing &&
    css`
      pointer-events: none;
    `};

  ${({ variant, showing }) =>
    variant === 'welcome' &&
    css`
      background: ${colors.blue};
      color: white;
      p {
        color: white !important;

        a {
          &:link,
          &:visited,
          &:active {
            color: white !important;
            &::before {
              background-color: white !important;
            }
          }
        }
      }
    `};
`

const Section = styled.div`
  ${lineHeight};
  ${space};
  position: relative;

  ${({ center }) =>
    center &&
    css`
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
    `};
`
const Content = styled.div`
  flex-grow: 1;
  flex-shrink: 0;

  ${space};
  ${color};

  p {
    text-align: center;
    line-height: 1.85;
    font-size: 16px;
    color: ${colors.grey[4]};
    a {
      &:link,
      &:visited,
      &:active {
        color: ${colors.grey[4]};
        position: relative;
        display: inline-block;
        &::before {
          opacity: 0.35;
          position: absolute;
          height: 1px;
          border-radius: 2px;
          top: calc(100% - 5px);
          left: -2px;
          width: calc(100% + 4px);
          content: '';
          background: ${colors.blue};
        }
      }
    }
  }

  form {
    padding-bottom: 20px;
    label {
      color: ${colors.grey[3]};
      font-weight: bold;
    }
    input {
      display: block;
      width: 100%;
      padding: 15px;
      border: 1px solid ${darken(0.05, colors.grey[1])};
      margin-bottom: 20px;
      outline: none;
      border-radius: 4px;
      border-bottom-width: 2px;
      border-bottom-color: ${darken(0.08, colors.grey[1])};
      &:focus {
        border-bottom-color: ${colors.blue};
      }
    }
    button {
      text-align: center;
      width: 100%;
    }
  }
`

const Footer = styled.footer`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`

const IconWrapper = styled.div`
  ${({ appConnect }) =>
    appConnect &&
    css`
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10px 20px;
      svg {
        * {
          fill: rgba(0, 0, 0, 0.5);
        }
      }
      img {
        margin: 5px;
        max-width: 48px;
      }
    `};
`

const Title = styled.div`
  ${space};
  ${lineHeight};
  h3 {
    text-align: center;
    font-weight: 600;
    line-height: 1.5;
  }
  h6 {
    padding-top: 5px;
    opacity: 0.75;
  }
`

const Progress = styled.div`
  position: absolute;
  z-index: 99;
  width: 100%;
  top: 0;
  right: 0;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  @media (min-width: 800px) {
    align-items: center;
    justify-content: center;
  }
`
const Dot = styled.div`
  width: 10px;
  height: 10px;
  background: transparent;
  opacity: 0.35;
  border-radius: 100%;
  margin: 4px;
  border: 1px solid ${colors.grey[3]};
  ${({ active }) =>
    active &&
    css`
      background: ${colors.blue};
      opacity: 1;
      border-color: ${colors.blue};
    `};
  ${({ complete }) =>
    complete &&
    css`
      display: flex;
      align-items: center;
      justify-content: center;
      border-color: ${colors.blue};
      color: ${colors.blue};
      background: transparent;
      opacity: 1;
      &::before {
        position: absolute;
        transform: translateY(-2px);
        content: '•';
      }
    `};
`

const InputOverlay = styled.div`
  text-align: right;
  position: absolute;
  height: 100%;
  width: 100%;
  padding: 15px;
  top: 0;
  left: 0;
  pointer-events: none;
  opacity: 0.5;
`

const ErrorMessage = styled.div`
  background: ${colors.grey[1]};
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  text-align: left;
  border-radius: 8px;
  margin-bottom: 20px;

  p {
    text-align: left;
    margin: 0;
    padding: 0;
    line-height: 1.25;
  }
`

const Icon = styled.div`
  display: flex;
  background: white;
  align-items: center;
  justify-content: center;
  padding: 5px;
  width: 36px;
  height: 36px;
  border-radius: 100%;
  margin-right: 10px;
  flex-shrink: 0;
  svg {
    display: block;
    * {
      fill: salmon;
    }
  }
`

const Header = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-bottom: 1px solid ${darken(0.05, colors.grey[1])};
  background:white;
  ${space};
  @media (min-width: 800px) {
    padding-top: 18px;
  }
  ${({ variant }) =>
    variant === 'small' &&
    css`
      flex-direction: row;
      ${IconWrapper} {
        flex-grow: 0;
        max-width: 48px;
        padding-right: 5px;
        img {
          max-width: 28px;
        }
      }
    `};
`

Panel.Card = Card
Panel.Card.Title = Title
Panel.Card.IconWrapper = IconWrapper
Panel.Card.Header = Header
Panel.Card.Content = Content
Panel.Card.InputOverlay = InputOverlay
Panel.Card.Section = Section
Panel.Card.ErrorMessage = ErrorMessage
Panel.Card.ErrorMessage.Icon = Icon
Panel.Progress = Progress
Panel.Progress.Dot = Dot

export default Panel
