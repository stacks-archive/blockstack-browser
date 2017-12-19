import React, { Component, PropTypes } from 'react'

class ConnectStorageView extends Component {
  static propTypes = {
    connectDropbox: PropTypes.func.isRequired,
    connectGaiaHub: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      showAdvanced: false
    }
    this.toggleView = this.toggleView.bind(this)
  }

  toggleView(event) {
    event.preventDefault()
    this.setState({
      showAdvanced: !this.state.showAdvanced
    })
  }


  render() {
    const showAdvanced = this.state.showAdvanced
    return (
      <div>
        {!showAdvanced ?
          <div>
            <h3 className="modal-heading m-t-15 p-b-20">
              Your data is stored on the storage provider of your choice.
            </h3>
            <img
              role="presentation"
              src="/images/blockstack-logo-vertical.svg"
              className="m-b-20 welcome-modal-icon"
              style={{ height: '110px' }}
            />
            <div className="m-t-40 modal-body">
              <button
                className="btn btn-primary btn-block m-b-20"
                onClick={this.props.connectGaiaHub}
              >
                Use default storage
              </button>
              <a href="#" className="modal-body" onClick={this.toggleView}>
                Preview alternative storage
              </a>
            </div>
          </div>
        :
          <div className="storage-page">
            <h3 className="modal-heading m-t-15 p-b-20">
              Alternative Storage Preview
            </h3>
            <p className="container-fluid">
              You control your data. 
              All data is encrypted and stored on the storage provider you choose. 
              Our default storage, Gaia, can be run on your own cloud storage instance.
            </p>
            <div className="m-t-40">
              <button
                className="btn btn-primary btn-block m-b-20"
                onClick={this.props.connectGaiaHub}
              >
                Use default storage
              </button>
              <button
                className="btn btn-primary btn-block m-b-20"
                onClick={this.props.connectDropbox}
                disabled
                title="See Github issue #908"
              >
                Connect Dropbox
              </button>
              <button
                className="btn btn-primary btn-block m-b-20"
                disabled
                title="Coming soon!"
              >
                Connect IPFS
              </button>
              <button
                className="btn btn-primary btn-block m-b-20"
                disabled
                title="Coming soon!"
              >
                Connect self-hosted storage
              </button>
              <div className="modal-body">
                <a href="#" className="modal-body" onClick={this.toggleView}>
                  Back
                </a>
              </div>
            </div>
          </div>
      }
      </div>
   )
  }
 }


export default ConnectStorageView
