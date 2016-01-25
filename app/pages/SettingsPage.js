import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import InputGroup from '../components/InputGroup'
import SaveButton from '../components/SaveButton'
import { SettingsActions } from '../store/settings'

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
      api: this.props.api,
      advancedSectionShown: false
    }

    this.onValueChange = this.onValueChange.bind(this)
    this.toggleAdvancedSection = this.toggleAdvancedSection.bind(this)
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

  toggleAdvancedSection() {
    this.setState({
      advancedSectionShown: !this.state.advancedSectionShown
    })
  }

  updateApi() {
    const api = this.state.api
    this.props.updateApi(
      api.nameLookupUrl,
      api.searchUrl,
      api.registerUrl,
      api.addressLookupUrl
    )
  }

  resetApi() {
    this.props.resetApi()
  }

  render() {
    return (
      <div>
        <div>
          <h3>Settings</h3>
          <h5>Backup Account</h5>
          <p>
            <Link to="/backup" className="btn btn-secondary">
              Backup Account
            </Link>
          </p>
          <h5>Update Password</h5>
          <p>
            <Link to="/newpassword" className="btn btn-secondary">
              Update Password
            </Link>
          </p>
          <hr />
          <p>
            <button onClick={this.toggleAdvancedSection} className="btn btn-secondary">
            { this.state.advancedSectionShown ?
              <span>Hide Advanced Section</span>
            :
              <span>Show Advanced Section</span>
            }
            </button>
          </p>
          { this.state.advancedSectionShown ?
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
              <div className="form-group">
                <SaveButton onSave={this.updateApi} />
              </div>
              <p>
                <button onClick={this.resetApi} className="btn btn-secondary">
                  Reset API
                </button>
              </p>
            </div>
          : null }
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsPage)
