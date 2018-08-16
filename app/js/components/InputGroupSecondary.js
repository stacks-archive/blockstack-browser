import PropTypes from 'prop-types'
import React from 'react'

const InputGroupSecondary = props => {
  let value = ''
  let type = 'text'
  let disabled = false
  let required = false
  let step = 1
  let min = ''

  if (props.data && props.name) {
    value = props.data[props.name]
  }
  if (props.step) {
    step = props.step
  }
  if (props.min) {
    min = props.min
  }
  if (props.type) {
    type = props.type
  }
  if (props.disabled) {
    disabled = props.disabled
  }
  if (props.required) {
    required = props.required
  }
  let inputClass = 'form-control form-control-secondary'
  if (props.inverse) {
    inputClass = 'form-inverse-control'
  }
  let labelClass = 'form-control-label form-control-label-secondary'
  if (props.inverse) {
    labelClass = 'form-control-label form-inverse-control-label'
  }

  return (
    <div className="form-group">
      <fieldset>
        <label className={`${labelClass}`}>
          {props.label}
          {props.action &&
            <button
              type="button"
              className="form-control-label-action"
              onClick={props.action.onClick}
            >
              {props.action.text}
            </button>
          }
        </label>
        <div className="">
          {props.textarea ?
            <textarea
              name={props.name}
              disabled={disabled}
              className={inputClass}
              type={type}
              placeholder={
                props.placeholder ? props.placeholder : props.label
              }
              value={value}
              onChange={props.onChange}
              rows={props.textareaRows || 2}
            />
          :
            <input
              name={props.name}
              disabled={disabled}
              className={inputClass}
              type={type}
              required={required}
              step={step}
              min={min}
              placeholder={
                props.placeholder ? props.placeholder : props.label
              }
              value={value}
              onChange={props.onChange}
            />
          }
        </div>
      </fieldset>
    </div>
  )
}

InputGroupSecondary.propTypes = {
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  step: PropTypes.number,
  min: PropTypes.string,
  name: PropTypes.string,
  data: PropTypes.object,
  onChange: PropTypes.func,
  type: PropTypes.string,
  disabled: PropTypes.bool,
  inverse: PropTypes.bool,
  textarea: PropTypes.bool,
  textareaRows: PropTypes.number,
  required: PropTypes.bool,
  action: PropTypes.shape({
    text: PropTypes.node.isRequired,
    onClick: PropTypes.func.isRequired
  })
}

export default InputGroupSecondary
