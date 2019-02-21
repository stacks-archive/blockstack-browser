import React from 'react'
import styled from 'styled-components'
import { WindowSize } from 'react-fns'
import { connect } from 'react-redux'

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
    background: white;
    .home-screen {
      display: none;
    }
  }
  .home-screen {
    padding-top: 100px;
  }
  * {
    pointer-events: none !important;
  }
`

const mapStateToProps = state => ({
  apps: state.apps,
  appListLastUpdated: state.apps.lastUpdated
})

const AppHomeWrapper = connect(mapStateToProps)(props => (
  <>
    {props.appListLastUpdated ? (
      <div
        style={{
          visibility: 'hidden',
          position: 'absolute',
          top: '-999999px',
          userSelect: 'none',
          pointerEvents: 'none'
        }}
        id="apps-loaded"
      />
    ) : null}
    <WindowSize>
      {({ width }) =>
        width > 599 ? (
          <StyledAppHomeWrapper {...props}>
            <div inert="true" htmlInert>
              <HomePage />
            </div>
          </StyledAppHomeWrapper>
        ) : null
      }
    </WindowSize>
  </>
))

export { AppHomeWrapper }
