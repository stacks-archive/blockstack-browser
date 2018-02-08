import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { SettingsActions } from '../../account/store/settings'
import InputGroup from '../../components/InputGroup'

function mapStateToProps(state) {
  return {
    api: state.settings.api
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, SettingsActions), dispatch)
}

class PairBrowserView extends Component {
  static propTypes = {
    api: PropTypes.object.isRequired,
    updateApi: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      advancedMode: false,
      coreAPIPassword: ''
    }
    this.onValueChange = this.onValueChange.bind(this)
    this.saveCoreAPIPassword = this.saveCoreAPIPassword.bind(this)
    this.toggleAdvancedMode = this.toggleAdvancedMode.bind(this)
  }

  onValueChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  saveCoreAPIPassword(event) {
    event.preventDefault()
    let api = this.props.api
    api = Object.assign({}, api, { coreAPIPassword: this.state.coreAPIPassword })
    this.props.updateApi(api)
  }

  toggleAdvancedMode(event) {
    event.preventDefault()
    this.setState({ advancedMode: !this.state.advancedMode })
  }

  render() {
    const advancedMode = this.state.advancedMode

    const imgStyle = {
      maxWidth: '80%',
      border: '1px solid #f0f0f0',
      margin: '0 auto',
      display: 'block'
    }

    return (
      <div>
      {!advancedMode ?
        <div>
          <h3 className="modal-heading">Please pair your browser with Blockstack</h3>
          <p className="modal-body">To pair your default browser with Blockstack, click on the
          Blockstack icon in your menu bar and then click on Home.</p>
          <img
            alt="Open this page via the Blockstack icon to pair your browser"
            src="/images/mac-open-from-menubar.png"
            style={imgStyle}
          />
          <p className="modal-body">
            <a href="#" className="modal-body" onClick={this.toggleAdvancedMode}>Advanced Mode</a>
          </p>
        </div>
        :
        <div>
          <h3 className="modal-heading">Enter your Blockstack Core API Password</h3>
          <p className="modal-body">Don’t know what this is?</p>
          <InputGroup
            name="coreAPIPassword"
            label="Core API Password"
            type="text"
            data={this.state} onChange={this.onValueChange}
          />
          <div>
            <button
              onClick={this.saveCoreAPIPassword}
              className="btn btn-primary btn-block"
            >
                Save Core API Password
            </button>
          </div>
          <p>
            <a href="#" className="modal-body" onClick={this.toggleAdvancedMode}>
              Go back to normal pairing mode.
            </a>
          </p>
        </div>
      }
      </div>
    )
  }
 }

export default connect(mapStateToProps, mapDispatchToProps)(PairBrowserView)
