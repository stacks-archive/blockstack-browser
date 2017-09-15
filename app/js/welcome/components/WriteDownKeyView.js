import React, { Component, PropTypes } from 'react'

class WriteDownkeyView extends Component {

  static propTypes = {
    identityKeyPhrase: PropTypes.string.isRequired,
    showNextView: PropTypes.func.isRequired,
    showPreviousView: PropTypes.func.isRequired
  }

  render() {
    return (
      <div>
        <h3 className="modal-heading">Write down your identity key for account recovery -
        don’t show it to anyone</h3>
        <p className="modal-body m-b-0 m-t-25">Identity key:</p>
        <p className="modal-body modal-code">{this.props.identityKeyPhrase}</p>
        <div className="m-t-40">
          <button className="btn btn-primary btn-block m-b-10" onClick={this.props.showNextView}>
            I’ve written it down
          </button>
          <p>
            <a href="#" className="modal-body" onClick={this.props.showPreviousView}>Back</a>
          </p>
        </div>
      </div>
     )
  }
}

WriteDownkeyView.propTypes = {
  identityKeyPhrase: PropTypes.string.isRequired,
  showNextView: PropTypes.func.isRequired
}

export default WriteDownkeyView
