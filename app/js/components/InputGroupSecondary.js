import PropTypes from 'prop-types'
import React, { Component } from 'react'

class InputGroupSecondary extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    step: PropTypes.number,
    name: PropTypes.string,
    data: PropTypes.object,
    onChange: PropTypes.func,
    type: PropTypes.string,
    disabled: PropTypes.bool,
    inverse: PropTypes.bool,
    textarea: PropTypes.bool,
    textareaRows: PropTypes.number,
    required: PropTypes.bool
  }

  render() {
    let value = '',
        type = "text",
        disabled = false,
        required = false,
        step = 1
    if (this.props.data && this.props.name) {
      value = this.props.data[this.props.name]
    }
    if (this.props.step) {
      step = this.props.step
    }
    if (this.props.type) {
      type = this.props.type
    }
    if (this.props.disabled) {
      disabled = this.props.disabled
    }
    if (this.props.required) {
      required = this.props.required
    }
    let inputClass = "form-control form-control-secondary"
    if (this.props.inverse) {
      inputClass = "form-inverse-control"
    }
    let labelClass = "form-control-label form-control-label-secondary"
    if (this.props.inverse) {
      labelClass = "form-control-label form-inverse-control-label"
    }

    return (
      <div className="form-group">
        <fieldset>
          <label className={`${labelClass}`}>
            {this.props.label}
          </label>
          <div className="">
            { this.props.textarea ?
              <textarea name={this.props.name}
              disabled={disabled}
              className={inputClass}
              type={type}
              placeholder={
                this.props.placeholder ? this.props.placeholder : this.props.label
              }
              value={value}
              onChange={this.props.onChange}
              rows={this.props.textareaRows || 2} />
            :
            <input name={this.props.name}
              disabled={disabled}
              className={inputClass}
              type={type}
              required={required}
              step={step}
              placeholder={
                this.props.placeholder ? this.props.placeholder : this.props.label
              }
              value={value}
              onChange={this.props.onChange} />
            }
          </div>
        </fieldset>
      </div>
    )
  }
}

export default InputGroupSecondary