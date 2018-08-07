import React, { PureComponent } from 'react'
import { withRouter } from 'react-router'

class ClearAuthPage extends PureComponent {
  state = {
    countdown: 5,
    hasAttemptedConfirm: false
  }

  componentDidMount() {
    this.decrementCountdown()
  }

  decrementCountdown() {
    setTimeout(() => {
      const { countdown } = this.state
      this.setState({ countdown: countdown - 1 })
      if (countdown > 1) {
        this.decrementCountdown()
      }
    }, 1000)
  }

  clearData = () => {
    if (this.state.hasAttemptedConfirm) {
      localStorage.clear()
      window.location = `${this.props.location.query.redirect_uri}://?authCleared=1`
    }
    else {
      this.setState({ hasAttemptedConfirm: true })
    }
  }

  cancel = () => {
    window.location = `${this.props.location.query.redirect_uri}://?authCleared=0`
  }

  render() {
    const { countdown, hasAttemptedConfirm } = this.state

    return (
      <div className="container-fluid">
        <h3 className="p-t-20">Sign Out</h3>
        <p className="p-t-20 alert alert-warning">
          <strong>Warning:</strong> This will reset your keychain and settings
          on this device. You’ll be able to restore your keychain, or create
          a new one afterwards.
          <br />
          <br />
          If you plan to restore your keychain, <strong>make sure you have
          recorded your backup information.</strong> You will either need your
          12 word secret key, or your magic recovery code and password to
          do so.
        </p>
        <div className="m-t-10">
          <button
            className="btn btn-danger btn-block"
            onClick={this.clearData}
            disabled={countdown > 0}
          >
            {hasAttemptedConfirm ? (
              <span>Press again to confirm</span>
            ) : (
              <span>Reset my data {countdown > 0 && `(${countdown})`}</span>
            )}

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
