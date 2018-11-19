import React from 'react'
import { Flex, Type } from '../../'
import { Hover, Active } from 'react-powerplug'
import epitath from 'epitath'
import PropTypes from 'prop-types'

/**
 * Handle our sizes
 */
const handleSize = ({ size, hovered, bg, ...rest }) => {
  if (size === 'small') {
    return {
      ...rest,
      height: 'auto',
      py: 1,
      px: 3,
      typeProps: {
        ...rest.typeProps,
        fontSize: '12px',
        fontWeight: 500
      },
      bg: hovered ? 'blue.light' : 'transparent',
      color: 'blue.dark',
      borderColor: hovered ? 'blue.dark' : 'blue.mid',
      boxShadow: hovered ? 'general' : 'none',
      border: '1px solid',
      flexGrow: [1, 0, 0],
      ml: [0, 2, 2],
      mr: [2, 0, 0]
    }
  }
  return { ...rest, size, bg, hovered }
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
  cleanProps(handleSize(handleOutline(handleInvert(props))))

const Button = epitath(function*({
  children,
  disabled,
  icon: Icon,
  outline,
  invert,
  style,
  bg,
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
    bg: bg ? bg : hovered ? 'blue' : 'blue.dark',
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
    style: {
      ...style,
      textDecoration: 'none',
      cursor: !disabled && hovered ? 'pointer' : undefined,
      transition: '.34s all cubic-bezier(.19,1,.22,1)',
      transform: active ? 'translateY(2px)' : 'none',
      outline: 'none'
    },
    ...props,
    ...bind
  }

  const labelProps = {
    ...typeProps,
    style: {
      ...typeStyle,
      whiteSpace: 'nowrap',
      pointerEvents: 'none',
      userSelect: 'none',
      transform: 'translateY(-1px)'
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
        style={{ pointerEvents: 'none' }}
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
    <Flex flexShrink={0} {...buttonProps}>
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
