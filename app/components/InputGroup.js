import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

class InputGroup extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    data: PropTypes.object.isRequired,
    label: PropTypes.string,
    onChange: PropTypes.func
  }

  render() {
    var value = this.props.data[this.props.name]
    return (
      <div className="form-group">
        <label className="sr-only">{this.props.label}</label>
        <input name={this.props.name}
          className="form-control input-lg"
          placeholder={
            this.props.placeholder ?
            this.props.placeholder :
            this.props.label
          }
          value={value}
          onChange={this.props.onChange} />
      </div>
    )
  }
}

export default InputGroup