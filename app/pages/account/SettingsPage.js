import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import { InputGroup, AccountSidebar, SaveButton } from '../../components/index'
import { SettingsActions } from '../../store/settings'

function mapStateToProps(state) {
  return {
    api: state.settings.api
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(SettingsActions, dispatch)
}

class SettingsPage extends Component {
  static propTypes = {
    api: PropTypes.object.isRequired,
    updateApi: PropTypes.func.isRequired,
    resetApi: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      api: this.props.api
    }

    this.onValueChange = this.onValueChange.bind(this)
    this.updateApi = this.updateApi.bind(this)
    this.resetApi = this.resetApi.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      api: nextProps.api
    })
  }

  onValueChange(event) {
    let api = this.state.api
    api[event.target.name] = event.target.value
    this.setState({ api: api })
  }

  updateApi() {
    const api = this.state.api
    this.props.updateApi(api)
  }

  resetApi() {
    this.props.resetApi()
  }

  render() {
    return (
      <div>
        <div className="page-header">
          <div className="container">
            <h1>Settings</h1>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-md-3">
              <AccountSidebar />
            </div>
            <div className="col-md-9">
              <div>
                <h5>Use Custom API</h5>
                <InputGroup name="nameLookupUrl" label="Name Lookup URL"
                  data={this.state.api} onChange={this.onValueChange} />
                <InputGroup name="searchUrl" label="Search URL"
                  data={this.state.api} onChange={this.onValueChange} />
                <InputGroup name="registerUrl" label="Register URL"
                  data={this.state.api} onChange={this.onValueChange} />
                <InputGroup name="addressLookupUrl" label="Address Names URL"
                  data={this.state.api} onChange={this.onValueChange} />
                <InputGroup name="s3ApiKey" label="S3 API Key"
                  data={this.state.api} onChange={this.onValueChange} />
                <InputGroup name="s3ApiSecret" label="S3 API Secret"
                  data={this.state.api} onChange={this.onValueChange} />
                <InputGroup name="s3Bucket" label="S3 Bucket"
                  data={this.state.api} onChange={this.onValueChange} />
                <div className="form-group">
                  <SaveButton onSave={this.updateApi} />
                </div>
                <p>
                  <button onClick={this.resetApi} className="btn btn-secondary">
                    Reset API
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsPage)
