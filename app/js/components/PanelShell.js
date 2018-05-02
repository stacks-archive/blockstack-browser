import React from 'react'
import PropTypes from 'prop-types'
import StyledPanel from '@styled/onboarding'
import Show from '@components/Show'
import * as Icons from 'mdi-react'
import { animated, Spring } from 'react-spring'
import Spinner from '@components/styled/Spinner'

const { SyncIcon } = Icons

const renderItems = (items, view) =>
  items.map(({ show, props, Component }, i) => (
    <Show key={i} when={view === show}>
      <Component {...props} showing={view === show} />
    </Show>
  ))

const PanelShell = ({ children, ...rest }) => (
  <StyledPanel {...rest} bg="grey.2">
    {children}
  </StyledPanel>
)

const PanelCardHeader = ({
  title = 'Create your Blockstack ID',
  icon = 'https://file-byvymyglhi.now.sh/',
  appIcon,
  variant,
  p = 3,
  pt = 5,
  pb = 3,
  mdi,
  h2,
  h5,
  ...rest
}) => {
  const AppIcon = appIcon && (
    <StyledPanel.Card.IconWrapper appConnect>
      {variant !== 'small' && <img src={icon} role="presentation" />}
      {variant !== 'small' && <SyncIcon />}
      {appIcon && <img src={appIcon} role="presentation" />}
    </StyledPanel.Card.IconWrapper>
  )

  const renderTitle = () => {
    if (!h2 && title) {
      return (
        <StyledPanel.Card.Title pt={2}>
          <h3>{title}</h3>
        </StyledPanel.Card.Title>
      )
    }
    if (h2) {
      let Icon = null
      if (mdi && Icons[mdi]) {
        Icon = Icons[mdi]
      }
      return (
        <StyledPanel.Card.Title pt={2} full>
          <StyledPanel.Card.Title.Wrapper>
            {Icon && <Icon size={'1.75rem'} color="#2c96ff" />}
            <h2>{h2}</h2>
          </StyledPanel.Card.Title.Wrapper>
          {h5 && <h5>{h5}</h5>}
        </StyledPanel.Card.Title>
      )
    }
    return null
  }
  return (
    <StyledPanel.Card.Header {...rest} p={p} pt={pt} pb={pb} variant={variant}>
      {icon && (
        <StyledPanel.Card.IconWrapper>
          {appIcon && AppIcon}
          {!appIcon && !mdi && <img src={icon} role="presentation" />}
        </StyledPanel.Card.IconWrapper>
      )}
      {renderTitle()}
    </StyledPanel.Card.Header>
  )
}

const PanelCard = ({
  variant = 'default',
  renderHeader = () => {},
  children,
  ...rest
}) => (
  <StyledPanel.Card {...rest} variant={variant}>
    {renderHeader()}
    <StyledPanel.Card.Content p={4}>{children}</StyledPanel.Card.Content>
  </StyledPanel.Card>
)

const InputOverlay = ({
  text,
  children,
  icon: { component: Icon, show },
  ...rest
}) => (
  <StyledPanel.Card.Section
    inputIcon={show}
    style={{
      position: 'relative'
    }}
    {...rest}
  >
    {Icon && (
      <StyledPanel.Card.InputIcon show={show}>
        <Icon color="green" />
      </StyledPanel.Card.InputIcon>
    )}
    {children}
    <StyledPanel.Card.InputOverlay>{text}</StyledPanel.Card.InputOverlay>
  </StyledPanel.Card.Section>
)

const Error = ({ icon, message }) => (
  <StyledPanel.Card.ErrorMessage>
    <StyledPanel.Card.ErrorMessage.Icon>
      {icon}
    </StyledPanel.Card.ErrorMessage.Icon>
    <p>{message}</p>
  </StyledPanel.Card.ErrorMessage>
)

const Loading = ({ show, message }) =>
  show && (
    <Spring
      from={{
        opacity: 0
      }}
      to={{
        opacity: 1
      }}
    >
      {styles => (
        <StyledPanel.Loading style={styles}>
          <Spinner />
          {message && (
            <Spring
              native
              from={{
                top: 20
              }}
              to={{
                top: 0
              }}
            >
              {textStyles => (
                <animated.h5
                  style={{
                    paddingTop: '20px',
                    ...textStyles
                  }}
                >
                  {message}
                </animated.h5>
              )}
            </Spring>
          )}
        </StyledPanel.Loading>
      )}
    </Spring>
  )

PanelCard.Loading = Loading
PanelCard.Section = StyledPanel.Card.Section
PanelCard.InputOverlay = InputOverlay
PanelCard.Error = Error

PanelShell.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.node,
  icon: PropTypes.node
}

PanelCardHeader.propTypes = {
  title: PropTypes.node,
  icon: PropTypes.node,
  appIcon: PropTypes.node,
  variant: PropTypes.node,
  p: PropTypes.node,
  pt: PropTypes.node,
  pb: PropTypes.node,
  mdi: PropTypes.node,
  h2: PropTypes.node,
  h5: PropTypes.node
}

PanelCard.propTypes = {
  children: PropTypes.node.isRequired,
  header: PropTypes.func,
  variant: PropTypes.string,
  renderHeader: PropTypes.func
}
Loading.propTypes = {
  show: PropTypes.bool,
  message: PropTypes.node
}
Error.propTypes = {
  icon: PropTypes.node,
  message: PropTypes.node
}
InputOverlay.propTypes = {
  text: PropTypes.node,
  children: PropTypes.node,
  icon: PropTypes.node,
  rest: PropTypes.object
}

export default PanelShell

export { PanelCard, PanelCardHeader, renderItems }
