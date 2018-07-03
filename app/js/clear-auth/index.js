import React, { PureComponent } from 'react'

export default class ClearAuthPage extends PureComponent {
  clearData() {
    localStorage.clear()
    window.location = 'myblockstackapp://?authCleared=1'
  }

  cancel() {
    window.close()
  }

  render() {
    return (
      <div className="container-fluid">
        <h3 className="p-t-20">Clear Application Data</h3>
        <p>
          <i>
            Are you sure you want to do this? It cannot be undone.
          </i>
        </p>
        <div className="m-t-40">
          <button className="btn btn-danger btn-block" onClick={this.clearData}>
            Clear Data
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
