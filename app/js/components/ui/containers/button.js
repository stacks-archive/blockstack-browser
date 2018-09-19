import React from 'react'
import { StyledButton, Buttons } from '@ui/components/button'
import PropTypes from 'prop-types'
import { Spinner } from '@ui/components/spinner'
import ArrowRightIcon from 'mdi-react/ArrowRightIcon'
import SearchIcon from 'mdi-react/SearchIcon'

const Button = ({
  label,
  children,
  type,
  loading,
  height = 44,
  placeholder = 'Loading...',
  icon,
  to,
  ...rest
}) => {
  const ButtonComponent = props => {
    if (to) {
      return <StyledButton.Link {...props} />
    } else if (type) {
      return <StyledButton {...props} type={type} />
    } else {
      return <StyledButton.Div {...props} />
    }
  }

  const SearchIconBool = icon === 'SearchIcon' ? SearchIcon : null

  const IconComponent =
    icon === 'ArrowRightIcon' ? ArrowRightIcon : SearchIconBool

  const content = loading ? (
    <React.Fragment>
      {placeholder}
      <Spinner ml={10} />
    </React.Fragment>
  ) : (
    <React.Fragment>{label || children}</React.Fragment>
  )

  const renderIcon = () =>
    icon &&
    !loading && (
      <StyledButton.Icon>
        <IconComponent size={18} color="rgba(75, 190, 190, 1)" />
      </StyledButton.Icon>
    )
  return (
    <ButtonComponent {...rest} loading={loading} height={height} to={to}>
      <StyledButton.Label>{content}</StyledButton.Label>
      {renderIcon()}
    </ButtonComponent>
  )
}

const renderButtons = items =>
  items.map(({ ...buttonProps }, i) => (
    <Button
      key={i}
      disabled={buttonProps.label === ' ' || buttonProps.label === ''}
      {...buttonProps}
    />
  ))

const ActionButtons = ({ items, split = false, ...rest }) =>
  items.length ? (
    <Buttons split={split} {...rest}>
      {renderButtons(items)}
    </Buttons>
  ) : null

ActionButtons.propTypes = {
  items: PropTypes.array.isRequired,
  split: PropTypes.bool
}

Button.Section = StyledButton.Section

Button.propTypes = {
  label: PropTypes.node,
  children: PropTypes.node,
  height: PropTypes.number,
  btn: PropTypes.bool,
  primary: PropTypes.bool,
  secondary: PropTypes.bool,
  textOnly: PropTypes.bool,
  disabled: PropTypes.bool,
  negative: PropTypes.bool,
  type: PropTypes.string,
  loading: PropTypes.bool,
  placeholder: PropTypes.node,
  icon: PropTypes.node,
  to: PropTypes.string
}

export { Button, Buttons, ActionButtons, renderButtons }
