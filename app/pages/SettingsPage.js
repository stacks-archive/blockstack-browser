import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import InputGroup from '../components/InputGroup'

export default class SettingsPage extends Component {
  constructor() {
    super()
  }

  render() {
    var settings = {}
    return (
      <div>
        <div>
          <h3>Settings</h3>

          <div>
            <button className="btn btn-primary">Backup Wallet</button>
          </div>

          <InputGroup name="resolverUrl" label="Resolver URL" data={settings} />

          <InputGroup name="registrarUrl" label="Registrar URL" data={settings} />
        </div>
      </div>
    )
  }
}
