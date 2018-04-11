import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import ChevronLeftIcon from 'mdi-react/ChevronLeftIcon'
const NavBlock = styled.div`
  display: flex;
  width: 100%;
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 100;
  @media (min-width: 800px) {
    top: -46px;
    left: -10px;
  }
`
const NavButton = styled.button`
  border: none;
  background: transparent;
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: bold;
  opacity: 0.5;
  &:hover {
    cursor: pointer;
    opacity: 1;
  }
  svg {
    display: block;
    * {
      fill: currentColor;
    }
  }
`

const Navigation = props => {
  const { previous, next, previousLabel = 'Back', nextLabel = 'Next' } = props

  return (
    <NavBlock>
      <NavButton onClick={previous}>
        <ChevronLeftIcon />
        {previousLabel}
      </NavButton>
    </NavBlock>
  )
}

Navigation.propTypes = {
  previous: PropTypes.func.isRequired,
  next: PropTypes.func.isRequired,
  previousLabel: PropTypes.string,
  nextLabel: PropTypes.string
}

export default Navigation
