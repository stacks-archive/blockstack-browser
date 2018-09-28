import React from 'react'
import { StyledButton, Buttons } from '@ui/components/button'
import PropTypes from 'prop-types'
import { Spinner } from '@ui/components/spinner'
import { Link } from 'react-router'
import ArrowRightIcon from 'mdi-react/ArrowRightIcon'
import QrcodeIcon from 'mdi-react/QrcodeIcon'
import SearchIcon from 'mdi-react/SearchIcon'

const iconMap = {
  SearchIcon,
  ArrowRightIcon,
  QrcodeIcon
}

const Button = ({
  label,
  children,
  type,
  loading,
  height = 44,
  placeholder = 'Loading...',
  icon,
  to,
  labelProps,
  ...rest
}) => {
  const ButtonComponent = props => {
    if (to) {
      return <StyledButton width={1} is={Link} {...props} />
    } else if (type) {
      return <StyledButton width={1} is="button" {...props} type={type} />
    } else {
      return <StyledButton width={1} is="div" {...props} />
    }
  }

  const IconComponent = iconMap[icon]

  const content = loading ? (
    <>
      {placeholder}
      <Spinner ml={10} />
    </>
  ) : (
    <>{label || children}</>
  )

  const renderIcon = () =>
    IconComponent &&
    !loading && (
      <StyledButton.Icon>
        <IconComponent
          size={18}
          color={rest.primary ? 'rgba(75, 190, 190, 1)' : 'rgba(0, 0, 0, 0.6)'}
        />
      </StyledButton.Icon>
    )
  return (
    <ButtonComponent {...rest} loading={loading} height={height} to={to}>
      <StyledButton.Label style={{whiteSpace: 'nowrap'}} {...labelProps}>{content}</StyledButton.Label>
      {renderIcon()}
    </ButtonComponent>
  )
}

const renderButtons = (items, split) =>
  items.map(({ ...buttonProps }, i) => {
    const margin = split ? { mt: '0 !important' } : {}
    const marginLeft = split && i !== 0 ? { ml: 3 } : { ml: 0 }
    const props = {
      ...margin,
      ...marginLeft
    }
    return (
      <Button
        key={i}
        disabled={buttonProps.label === ' ' || buttonProps.label === ''}
        {...buttonProps}
        {...props}
      />
    )
  })

const ActionButtons = ({ items, split = false, ...rest }) =>
  items.length ? (
    <Buttons flexDirection={split ? 'row' : 'column'} {...rest}>
      {renderButtons(items, split)}
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
  labelProps: PropTypes.object,
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
