import styled, { css } from 'styled-components'
import { spacing } from '@ui/common/constants'
import { trans } from '@ui/common'

const Section = styled.div`
  display: flex;
  flex-grow: 1;
  align-items: center;
  &:last-of-type:not(:first-of-type) {
    justify-content: flex-end;
  }
`
const Link = styled.div`
  display: flex;
  align-items: center;
  color: currentColor;
  ${trans};
  outline: none;
  user-select: none;
  opacity: 0.4;
  ${({ disable }) =>
    disable &&
    css`
      pointer-events: none !important;
      opacity: 0.4 !important;
    `};
  &:hover {
    ${({ onClick }) =>
      onClick &&
      css`
        cursor: pointer;
        opacity: 1;
      `};
  }
  &:active {
    ${({ onClick }) =>
      onClick &&
      css`
        transform: translateY(2px);
      `};
  }
`

const Icon = styled.div`
  margin-right: 5px;
  svg {
    display: block;
    * {
      fill: currentColor;
    }
  }
`

const Label = styled.div`
  font-style: normal;
  font-weight: normal;
  line-height: 29px;
  font-size: 18px;
  outline: none;
  user-select: none;
`

const StyledHeader = styled.header`
  display: flex;
  justify-content: space-between;
  padding-bottom: ${spacing.gutter};
  border-bottom: 0;
  color: rgba(39, 16, 51, 1);

  @media (max-width: 900px) {
    ${({ invert }) =>
      invert &&
      css`
        color: white;
      `};
  }
`

StyledHeader.Section = Section
StyledHeader.Link = Link
StyledHeader.Link.Icon = Icon
StyledHeader.Link.Label = Label

export { StyledHeader }
