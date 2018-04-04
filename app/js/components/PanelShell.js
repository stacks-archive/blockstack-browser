import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import StyledPanel from '@styled/onboarding'

const PanelShell = ({ children, ...rest }) => (
  <StyledPanel {...rest} bg="grey.2">
    {children}
  </StyledPanel>
)

const PanelCardHeader = ({
  title = 'Create your Blockstack ID',
  icon = 'https://file-byvymyglhi.now.sh/',
  p = 3,
  pt = 5,
  pb = 3,
  ...rest
}) => {
  return (
    <StyledPanel.Card.Header p={p} pt={pt} pb={pb} {...rest}>
      {icon && (
        <StyledPanel.Card.IconWrapper>
          <img src={icon} />
        </StyledPanel.Card.IconWrapper>
      )}
      {title && (
        <StyledPanel.Card.Title pt={2}>
          <h3>{title}</h3>
        </StyledPanel.Card.Title>
      )}
    </StyledPanel.Card.Header>
  )
}

const PanelCard = ({
  variant = 'default',
  renderHeader = () => {},
  children,
  ...rest
}) => {
  return (
    <StyledPanel.Card {...rest} variant={variant}>
      {renderHeader()}
      <StyledPanel.Card.Content p={4}>{children}</StyledPanel.Card.Content>
    </StyledPanel.Card>
  )
}

PanelCard.Section = StyledPanel.Card.Section
PanelCard.InputOverlay = ({ text, children, ...rest }) => (
  <StyledPanel.Card.Section>
    {children}
    <StyledPanel.Card.InputOverlay>{text}</StyledPanel.Card.InputOverlay>
  </StyledPanel.Card.Section>
)

PanelCard.Error = ({ icon, message }) => (
  <StyledPanel.Card.ErrorMessage>
    <StyledPanel.Card.ErrorMessage.Icon>
      {icon}
    </StyledPanel.Card.ErrorMessage.Icon>
    <p>{message}</p>
  </StyledPanel.Card.ErrorMessage>
)

PanelShell.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.node,
  icon: PropTypes.node
}

PanelCardHeader.propTypes = {
  title: PropTypes.node,
  icon: PropTypes.node
}

PanelCard.propTypes = {
  children: PropTypes.node.isRequired,
  header: PropTypes.func
}

export default PanelShell

export { PanelCard, PanelCardHeader }
