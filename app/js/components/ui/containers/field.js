import React from 'react'
import PropTypes from 'prop-types'
import { StyledField } from '@ui/components/form'
import { slugify } from '@ui/common'
import { AlertCircleIcon, CheckCircleOutlineIcon } from 'mdi-react'

const Field = ({
  label,
  type = 'text',
  message,
  autoFocus,
  error,
  positive,
  overlay,
  name = slugify(label),
  mh,
  handleChange,
  handleChangeOverride,
  handleBlur,
  onBlur,
  ...rest
}) => {
  const InputComponent =
    type === 'textarea' ? StyledField.Textarea : StyledField.Input

  const LabelIconComponent = positive ? CheckCircleOutlineIcon : AlertCircleIcon
  const LabelIcon = (error || positive) && (
    <StyledField.Label.Icon positive={positive}>
      <LabelIconComponent size={16} />
    </StyledField.Label.Icon>
  )
  /**
   * TODO: abstract out qualified message to one component that takes multiple states
   */
  const PositiveMessage = positive && (
    <StyledField.Input.Positive overlay={!!overlay}>
      {positive}
    </StyledField.Input.Positive>
  )
  const ErrorMessage = (
    <StyledField.Input.Error overlay={!!overlay}>
      {error}
    </StyledField.Input.Error>
  )

  const Overlay = overlay && (
    <StyledField.Input.Overlay>{overlay}</StyledField.Input.Overlay>
  )

  const _handleChange = (e) => {
    if (handleChangeOverride) {
      handleChangeOverride(e, handleChange)
    } else {
      handleChange(e)
    }
  }

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
          onChange={_handleChange}
          lowercase={type !== 'password'}
        />
        {PositiveMessage}
        {ErrorMessage}
        <StyledField.Label htmlFor={name}>
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
