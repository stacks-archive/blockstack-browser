import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import InputGroup from '../components/InputGroup'
import { SaveButton } from '../components/Buttons'
import * as SettingsActions from '../actions/settings'

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
    updateApi: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      api: this.props.api
    }
  }

  onChange(event) {
    console.log(event.target)
  }

  render() {
    var settings = {}
    return (
      <div>
        <div>
          <h3>Settings</h3>

          <h5>Fund Account</h5>

          <p>
            <Link to="/deposit" className="btn btn-primary">
              Deposit
            </Link>
          </p>

          <h5>Backup Account</h5>

          <p>
            <Link to="/backup" className="btn btn-primary">
              Backup
            </Link>
          </p>

          <h5>Use Custom API Endpoints</h5>

          <fieldset disabled>
            <InputGroup name="nameLookupUrl" label="Name Lookup URL"
              data={this.state.api} onChange={this.onChange} />
          </fieldset>
          <fieldset disabled>
            <InputGroup name="searchUrl" label="Search URL"
              data={this.state.api} onChange={this.onChange} />
          </fieldset>
          <fieldset disabled>
            <InputGroup name="registerUrl" label="Register URL"
              data={this.state.api} onChange={this.onChange} />
          </fieldset>
          <fieldset disabled>
            <InputGroup name="addressLookupUrl" label="Address Names URL"
              data={this.state.api} onChange={this.onChange} />
          </fieldset>
          <div className="form-group">
            <SaveButton />
          </div>

        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsPage)
