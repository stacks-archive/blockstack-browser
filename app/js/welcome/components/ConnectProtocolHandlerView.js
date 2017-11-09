import React, { Component, PropTypes } from 'react'
import { registerWebProtocolHandler } from '../../utils/window-utils'

class ConnectProtocolHandlerView extends Component {
  static propTypes = {
    showNextView: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      alreadyAsked: false
    }
    this.askAndUpdate = this.askAndUpdate.bind(this)
  }

  askAndUpdate(event) {
    event.preventDefault()
    registerWebProtocolHandler()
    this.setState({
      alreadyAsked: true
    })
  }


  render() {
    const alreadyAsked = this.state.alreadyAsked
    return (
      <div>
        {!alreadyAsked ?
          <div>
            <h3 className="modal-heading m-t-15 p-b-20">
              We use a protocol handler to authenticate
              with Blockstack apps.
            </h3>
            <p>
              When you click "Okay", your browser will ask if you
              want to register the protocol handler.
            </p>
            <div className="m-t-40 modal-body">
              <button
                className="btn btn-primary btn-block m-b-20"
                onClick={this.askAndUpdate}
              >
                Okay
              </button>
            </div>
          </div>
        :
          <div>
            <h3 className="modal-heading m-t-15 p-b-20">
              We use a protocol handler to authenticate
              with Blockstack apps.
            </h3>
            <p>
              When you click "Okay", your browser will ask if you
              want to register the protocol handler.
            </p>
            <div className="m-t-40 modal-body">
              <button
                className="btn btn-primary btn-block m-b-20"
                onClick={this.props.showNextView}
              >
                Continue
              </button>
            </div>
          </div>
        }
      </div>
   )
  }
 }


export default ConnectProtocolHandlerView
