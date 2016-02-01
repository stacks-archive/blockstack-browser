import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

class InputGroup extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    name: PropTypes.string,
    data: PropTypes.object,
    onChange: PropTypes.func,
    type: PropTypes.string,
    disabled: PropTypes.bool
  }

  render() {
    let value = '',
        type = "text",
        disabled = false
    if (this.props.data && this.props.name) {
      value = this.props.data[this.props.name]
    }
    if (this.props.type) {
      type = this.props.type
    }
    if (this.props.disabled) {
      disabled = this.props.disabled
    }
    return (
      <fieldset className="form-group">
        <label>{this.props.label}</label>
        <input name={this.props.name}
          disabled={disabled}
          className="form-control"
          type={type}
          placeholder={this.props.placeholder ? this.props.placeholder : this.props.label}
          value={value}
          onChange={this.props.onChange} />
      </fieldset>
    )
  }
}

export default InputGroup