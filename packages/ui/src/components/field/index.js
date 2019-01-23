import React from 'react'
import { Flex, Type, Input, Tooltip, Box } from '../../index'
import { Copy } from '../copy'
import { OpenInNewIcon } from 'mdi-react'
import { Hover } from 'react-powerplug'

const Link = ({ value, text = 'View in Explorer', ...rest }) => (
  <Hover>
    {({ hovered, bind }) => (
      <Flex
        color="blue.medium"
        opacity={hovered ? 1 : 0.5}
        target="_blank"
        alignItems="center"
        justifyContent="center"
        transition={1}
        cursor="pointer"
        {...rest}
        {...bind}
      >
        <Tooltip text={text}>
          <Flex p={1}>
            <OpenInNewIcon size={20} />
          </Flex>
        </Tooltip>
      </Flex>
    )}
  </Hover>
)
const Label = ({ ...rest }) => (
  <Type pb={2} fontWeight={600} fontSize={1} is="label" {...rest} />
)

const Message = ({ children, ...rest }) => (
  <Box pb={3} {...rest}>
    <Type
      fontSize={1}
      color="blue.medium" // TODO: allow to be changed
    >
      {children}
    </Type>
  </Box>
)

const LabelComponent = ({
  hint,
  required,
  error,
  label,
  message,
  errorProps = {},
  messageProps = {},
  labelProps = {},
  ...rest
}) => (
  <>
    <Flex
      justifyContent={['flex-start', 'space-between']}
      alignItems={['flex-start', 'center']}
      flexDirection={['column', 'row']}
      width={1}
      {...rest}
    >
      <Label {...labelProps}>
        {label}
        {hint ? (
          <Type
            pl={1}
            fontSize={1}
            fontWeight={400}
            color="blue.medium" // TODO: allow to be changed
          >
            ({hint})
          </Type>
        ) : null}
        {required ? (
          <Type
            is="em"
            pl={1}
            color="blue.medium" // TODO: allow to be changed
            fontSize={1}
            fontWeight={400}
          >
            (required)
          </Type>
        ) : null}
      </Label>
      {error ? (
        <Type
          color="#F27D66" // TODO: allow to be changed
          textAlign="right"
          pb={2}
          fontWeight={500}
          fontSize={0}
          {...errorProps}
        >
          {error}
        </Type>
      ) : null}
    </Flex>
    {message ? <Message {...messageProps}>{message}</Message> : null}
  </>
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
  required,
  hint,
  message,
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
        borderColor: '#F27D66', // TODO: allow to be changed
        boxShadow: 'focused.error'
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
          <LabelComponent
            label={label}
            error={error}
            hint={hint}
            required={required}
            message={message}
          />

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
                color="blue.medium" // TODO: allow to be changed
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
Field.LabelAdvanced = LabelComponent
Field.Message = Message
Field.Link = Link

export { Field, Label, StaticField }
