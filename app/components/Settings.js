import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import InputGroup from './InputGroup'

class Settings extends Component {
  constructor() {
    super()
  }

  render() {
    var settings = {}
    return (
      <div className="container-337">
        <div>
          <h3>Settings</h3>
          <InputGroup name="resolverUrl" label="Resolver URL" data={settings} />
          <InputGroup name="registrarUrl" label="Registrar URL" data={settings} />
        </div>
      </div>
    )
  }
}

export default Settings
