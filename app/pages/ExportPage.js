import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import InputGroup from '../components/InputGroup'

class ExportPage extends Component {
  constructor() {
    super()
  }

  render() {
    return (
      <div>
        <div>
          <h3>Export Identity</h3>

          <p>Export your identity to another address.</p>

          <InputGroup label="Recipient address" placeholder="Recipient address" />

          <div>
            <button className="btn btn-primary">Send</button>
          </div>
        </div>
      </div>
    )
  }
}

export default ExportPage