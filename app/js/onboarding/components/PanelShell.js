import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Wrapper = styled.div`
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  box-shadow: 0 3px 3px #efefef;

  & h3 {
    text-align: center;
  }
`

const PanelShell = ({ children }) => (
  <Wrapper>
    {children}
  </Wrapper>
)

PanelShell.propTypes = {
  children: PropTypes.node.isRequired
}

export default PanelShell
