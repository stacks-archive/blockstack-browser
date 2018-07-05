import React, { PureComponent } from 'react'
import { withRouter } from 'react-router'

class ClearAuthPage extends PureComponent {
  clearData = () => {
    localStorage.clear()
    window.location = `${this.props.location.query.protocol}://?authCleared=1`
  }

  cancel = () => {
    window.location = `${this.props.location.query.protocol}://?authCleared=0`
  }

  render() {
    return (
      <div className="container-fluid">
        <h3 className="p-t-20">Sign Out</h3>
        <p>
          <i>
            Erase your keychain and settings so you can create a new one or restore another keychain.
          </i>
        </p>
        <div className="m-t-40">
          <button className="btn btn-danger btn-block" onClick={this.clearData}>
            Confirm
          </button>
        </div>
        <div className="m-t-10">
          <button className="btn btn-tertiary btn-block" onClick={this.cancel}>
            Cancel
          </button>
        </div>
      </div>
    )
  }
}

export default withRouter(ClearAuthPage)
