import React from 'react'
import { Flex, Type } from '../../'
import { Hover, Active } from 'react-powerplug'
import epitath from 'epitath'
import PropTypes from 'prop-types'

/**
 * Handle our sizes
 */
const handleSize = ({ size, ...rest }) => {
  if (size === 'small') {
    return {
      ...rest,
      px: 4,
      height: '36px',
      typeProps: {
        ...rest.typeProps,
        fontSize: 1
      }
    }
  }
  return { ...rest }
}

/**
 * Inverts the colors to white
 */
const handleInvert = ({ invert, hovered, active, disabled, ...rest }) =>
  invert
    ? {
        ...rest,
        bg: 'white',
        color: rest.bg
      }
    : rest

/**
 * Makes a button outlined
 */
const handleOutline = ({ outline, ...rest }) =>
  outline
    ? {
        ...rest,
        bg: 'transparent',
        borderColor: rest.bg,
        color: rest.bg
      }
    : rest
/**
 * This removes any props we don't want passed along to the final component/dom element
 */
const cleanProps = ({ hovered, active, outline, invert, ...rest }) => rest

const propFn = (props) =>
  cleanProps(handleOutline(handleInvert(handleSize(props))))

const Button = epitath(function*({
  children,
  disabled,
  icon: Icon,
  outline,
  invert,
  style,
  ...rest
}) {
  const { active, bind: activeBind } = yield <Active />
  const { hovered, bind: hoverBind } = yield <Hover />
  const bind = { ...activeBind, ...hoverBind }

  const defaultProps = {
    is: 'button',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    px: 5,
    height: '48px',
    borderColor: 'transparent',
    bg: hovered ? 'blue' : 'blue.dark',
    color: 'white',
    border: 2,
    borderRadius: 50,
    boxShadow: hovered ? 'button.hover' : 'button',
    fontWeight: 'semibold',
    variant: 'default',
    fontSize: 2,
    typeProps: {
      fontSize: 2
    }
  }

  const {
    typeProps: { typeStyle, ...typeProps },
    ...props
  } = propFn({
    ...defaultProps,
    hovered: hovered ? 'true' : undefined,
    active: active ? 'true' : undefined,
    outline,
    invert,
    ...rest
  })

  const buttonProps = {
    ...props,
    ...bind,
    style: {
      ...style,
      textDecoration: 'none',
      cursor: !disabled && hovered ? 'pointer' : undefined,
      transition: '.34s all cubic-bezier(.19,1,.22,1)',
      transform: active ? 'translateY(2px)' : 'none',
      outline: 'none'
    }
  }

  const labelProps = {
    ...typeProps,
    style: {
      ...typeStyle,
      whiteSpace: 'nowrap'
    },
    display: 'inline-block'
  }

  const IconComponent = ({ borderColor, color, ...p }) =>
    Icon ? (
      <Flex
        alignItems="center"
        justifyContent="center"
        color={outline ? borderColor : invert ? color : 'blue.accent'}
        pl={2}
      >
        <Icon
          color="currentColor"
          size="1.2rem"
          style={{
            display: 'block'
          }}
        />
      </Flex>
    ) : null

  return (
    <Flex {...buttonProps}>
      <Type {...labelProps}>{children}</Type>
      <IconComponent {...buttonProps} />
    </Flex>
  )
})

const Buttons = (props) => <Flex {...props} />

Buttons.defaultProps = {
  justifyContent: 'space-evenly'
}

Button.propTypes = {
  outline: PropTypes.bool,
  invert: PropTypes.bool,
  size: PropTypes.oneOf(['small'])
}

export { Button, Buttons }
