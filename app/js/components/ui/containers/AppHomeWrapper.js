import React from 'react'
import styled from 'styled-components'
import HomePage from '../../../HomeScreenPage'
const StyledAppHomeWrapper = styled.div.attrs({
  inert: true
})`
  filter: blur(4px);
  max-height: 100vh;
  overflow: hidden;
  height: 100vh;
  position: fixed;
  width: 100%;
  left: 0;
  top: 0;
  @media (max-width: 599px) {
    display: none;
  }
  .home-screen {
    padding-top: 100px;
  }
  * {
    pointer-events: none !important;
  }
`

const AppHomeWrapper = props => (
  <StyledAppHomeWrapper {...props}>
    <div inert="true" htmlInert>
      <HomePage />
    </div>
  </StyledAppHomeWrapper>
)

export { AppHomeWrapper }
