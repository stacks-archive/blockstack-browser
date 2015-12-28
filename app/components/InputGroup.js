import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

export default class InputGroup extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    name: PropTypes.string,
    data: PropTypes.object,
    onChange: PropTypes.func
  }

  render() {
    var value = '' 
    if (this.props.data && this.props.name) {
      value = this.props.data[this.props.name]
    }
    return (
      <div className="form-group">
        <label className="capitalize">{this.props.label}</label>
        <input name={this.props.name}
          className="form-control input-lg"
          placeholder={this.props.placeholder ? this.props.placeholder : this.props.label}
          value={value}
          onChange={this.props.onChange} />
      </div>
    )
  }
}