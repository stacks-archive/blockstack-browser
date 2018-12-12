import React from 'react'
import { Flex, Type, Input, Tooltip } from '../../index'
import { Copy } from '../copy'
import { OpenInNewIcon } from 'mdi-react'
import { Hover } from 'react-powerplug'

const Link = ({ value, ...rest }) => (
  <Hover>
    {({ hovered, bind }) => (
      <Flex
        color="hsl(205, 30%, 70%)"
        opacity={hovered ? 1 : 0.5}
        target="_blank"
        alignItems="center"
        justifyContent="center"
        transition={1}
        cursor="pointer"
        {...rest}
        {...bind}
      >
        <Tooltip text="View in Explorer">
          <Flex p={1}>
            <OpenInNewIcon size={20} />
          </Flex>
        </Tooltip>
      </Flex>
    )}
  </Hover>
)
const Label = ({ ...rest }) => (
  <Type pb={2} fontWeight={500} fontSize={1} is="label" {...rest} />
)
/**
 * Field
 * @param {any} label - The label (typically a string)
 * @param {any} overlay - Text to overlay input eg STX
 * @param {string} value - text value
 * @param {string} link - a related url to expose on hover
 * @param {string} error - an error message
 * @param {boolean} disabled
 * @param {boolean} copy - to enable copy and paste
 * @param {object} inputProps - the spread of the remaining props to pass to the input component
 * @param {string} variant - to enable copy and paste
 */
const Field = ({
  label,
  overlay,
  disabled = false,
  copy,
  value,
  variant,
  link,
  error,
  ...inputProps
}) => {
  const disabledProps = disabled
    ? {
        disabled,
        bg: 'blue.light' // TODO: allow to be changed
      }
    : {}

  const errorProps = error
    ? {
        borderColor: '#F27D66' // TODO: allow to be changed
      }
    : {}
  return (
    <Hover>
      {({ hovered, bind }) => (
        <Flex
          {...bind}
          flexDirection={'column'}
          pb={5}
          width={1}
          flexGrow={1}
          flexShrink={0}
        >
          <Flex justifyContent="space-between" alignItems="center">
            <Type pb={2} fontWeight={500} fontSize={1} is="label">
              {label}
            </Type>
            {error ? (
              <Type
                color="#F27D66" // TODO: allow to be changed
                textAlign="right"
                pb={2}
                fontWeight={500}
                fontSize={1}
              >
                {error}
              </Type>
            ) : null}
          </Flex>
          <Flex position="relative" width="100%">
            {copy && hovered ? (
              <Copy position="absolute" height="100%" value={value} right={0} />
            ) : null}
            {link && hovered ? (
              <Link position="absolute" height="100%" value={link} right={40} />
            ) : null}
            {overlay ? (
              <Type
                pr={4}
                position="absolute"
                height={'100%'}
                display="inline-flex"
                alignItems="center"
                top="0"
                right={0}
                color="hsl(205, 30%, 70%)" // TODO: allow to be changed
              >
                {overlay}
              </Type>
            ) : null}
            <Input
              width="100%"
              flexGrow={1}
              value={value}
              pr={
                copy && link && hovered
                  ? 80
                  : (copy || link) && hovered
                    ? 38
                    : 4
              }
              variant={variant}
              {...disabledProps}
              {...errorProps}
              {...inputProps}
            />
          </Flex>
        </Flex>
      )}
    </Hover>
  )
}

const StaticField = ({ ...rest }) => <Field width={1} disabled copy {...rest} />

Field.Label = Label
Field.Link = Link

export { Field, Label, StaticField }
