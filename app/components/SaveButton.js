import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

class SaveButton extends Component {
  static propTypes = {
    onSave: PropTypes.func
  }

  constructor() {
    super()

    this.state = {
      profileJustSaved: false
    }

    this.triggerSave = (event) => {
      this.setState({profileJustSaved: true})
      setTimeout(() => {
        this.setState({profileJustSaved: false})
      }, 500)
      if (this.props.onSave) {
        this.props.onSave()
      }
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