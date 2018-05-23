import React from 'react'
import PropTypes from 'prop-types'
import { StyledField } from '@ui/components/form'
import { slugify } from '@ui/common'
import { AlertCircleIcon } from 'mdi-react'

const Field = ({
  label,
  type = 'text',
  message,
  autoFocus,
  error,
  overlay,
  name = slugify(label),
  mh,
  handleChange,
  handleBlur,
  onBlur,
  ...rest
}) => {
  const InputComponent =
    type === 'textarea' ? StyledField.Textarea : StyledField.Input
  const LabelIcon = error && (
    <StyledField.Label.Icon>
      <AlertCircleIcon size={16} />
    </StyledField.Label.Icon>
  )

  const ErrorMessage = (
    <StyledField.Input.Error overlay={!!overlay}>
      {error}
    </StyledField.Input.Error>
  )

  const Overlay = overlay && (
    <StyledField.Input.Overlay>{overlay}</StyledField.Input.Overlay>
  )

  return (
    <StyledField.Group error={error} {...rest}>
      <StyledField.Input.Wrapper>
        {Overlay}
        <InputComponent
          placeholder={label}
          autoComplete="new-password"
          required
          name={name}
          type={type}
          autoFocus={autoFocus}
          mh={mh}
          onChange={handleChange}
        />
        {ErrorMessage}
        <StyledField.Label for={name}>
          {label}
          {LabelIcon}
        </StyledField.Label>
        <StyledField.Input.Bar />
      </StyledField.Input.Wrapper>
      {message && (
        <StyledField.Input.Message>{message}</StyledField.Input.Message>
      )}
    </StyledField.Group>
  )
}

Field.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  message: PropTypes.string,
  autoFocus: PropTypes.bool
}

export { Field }
