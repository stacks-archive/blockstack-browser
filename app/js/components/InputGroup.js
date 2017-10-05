import React, { Component, PropTypes } from 'react'

class InputGroup extends Component {
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
    required: PropTypes.bool,
    onReturnKeyPress: PropTypes.func,
    onBlur: PropTypes.func,
    stopClickPropagation: PropTypes.bool
  }

  constructor(props) {
    super(props)

    this.onKeyPress = this.onKeyPress.bind(this)
    this.onBlur = this.onBlur.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }

  onKeyPress(e) {
    if (this.props.onReturnKeyPress !== undefined) {
      if(e.key === 'Enter') {
        this.props.onReturnKeyPress()
      }
    }
  }

  onBlur(e) {
    if (this.props.onBlur !== undefined) {
      this.props.onBlur(e)
    }
  }

  handleClick(e) {
    if(this.props.stopClickPropagation) {
      e.stopPropagation()
    }
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
    let inputClass = "form-control"
    if (this.props.inverse) {
      inputClass = "form-inverse-control"
    }
    let labelClass = "form-control-label"
    if (this.props.inverse) {
      labelClass = "form-control-label form-inverse-control-label"
    }

    return (
      <div className="form-group m-b-11" onClick={this.handleClick}>
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
              onChange={this.props.onChange}
              onBlur={this.onBlur}
              onKeyPress={this.onKeyPress} />
            }
          </div>
        </fieldset>
      </div>
    )
  }
}

export default InputGroup
