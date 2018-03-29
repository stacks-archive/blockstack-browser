import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const NavBlock = styled.div`
  display: flex;
  width: 100%;
`
const NavButton = styled.button`
  flex: 0 0 50%;
`

const Navigation = props => {
  const {
    previous,
    next,
    previousLabel = 'Previous',
    nextLabel = 'Next'
  } = props

  return (
    <NavBlock>
      <NavButton onClick={previous}>{previousLabel}</NavButton>
      <NavButton onClick={next}>{nextLabel}</NavButton>
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
