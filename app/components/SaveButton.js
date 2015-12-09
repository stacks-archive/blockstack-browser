import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

class SaveButton extends Component {
  static propTypes = {
    onSave: PropTypes.func.isRequired
  }

  constructor() {
    super()

    this.state = {
      profileJustSaved: false
    }

    this.triggerSave = (event) => {
      this.setState({profileJustSaved: true})
      var _this = this
      setTimeout(function() {
        _this.setState({profileJustSaved: false})
      }, 500)
    }
  }

  render() {
    return (
      <div>
      { this.state.profileJustSaved ?
        <button className="btn btn-success" disabled>
            Saving...
        </button>
      :
        <button className="btn btn-primary" onClick={this.triggerSave}>
            Save
        </button>
      }
      </div>
    )
  }
}

export default SaveButton