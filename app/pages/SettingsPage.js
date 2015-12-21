import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import InputGroup from '../components/InputGroup'
import { SaveButton } from '../components/Buttons'

export default class SettingsPage extends Component {
  constructor() {
    super()
  }

  render() {
    var settings = {}
    return (
      <div>
        <div>
          <h2>Settings</h2>

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

          <div className="form-group">
            <InputGroup name="resolverUrl" label="Resolver URL" data={settings} />
          </div>
          <div className="form-group">
            <InputGroup name="registrarUrl" label="Registrar URL" data={settings} />
          </div>
          <div className="form-group">
            <SaveButton />
          </div>

        </div>
      </div>
    )
  }
}
