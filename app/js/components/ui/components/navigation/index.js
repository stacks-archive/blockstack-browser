import styled, { css } from 'styled-components'
import { Link } from 'react-router'

const StyledNavigation = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  border-bottom: 1px solid rgba(39, 16, 51, 0.1);
  height: 84px;
  * {
    text-decoration: none !important;
  }
`

const Wrapper = styled.div`
  max-width: 800px;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
`
const Section = styled.div`
  display: flex;
  flex-grow: 1;
  &:last-of-type {
    justify-content: flex-end;
  }
`

const Item = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  height: 84px;
  * {
    user-select: none;
  }

  color: #949494;
  ${({ active }) =>
    active &&
    css`
      pointer-events: none !important;
      cursor: default;
      color: #2c96ff;
    `};
  &:hover {
    color: #2c96ff;
  }
`

const Icon = styled.div`
  svg {
    * {
      fill: currentColor;
    }
  }
`
const Label = styled.div`
  color: currentColor;
`

StyledNavigation.Wrapper = Wrapper
StyledNavigation.Section = Section
StyledNavigation.Item = Item
StyledNavigation.Item.Icon = Icon
StyledNavigation.Item.Label = Label

export { StyledNavigation }
