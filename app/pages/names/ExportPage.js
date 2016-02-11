import React, { Component, PropTypes } from 'react'

import { PageHeader } from '../../components/index'
import { InputGroup } from '../../components/index'

class ExportPage extends Component {
  constructor() {
    super()
  }

  render() {
    return (
      <div className="body-inner body-inner-white">
        <PageHeader title="Export" />
        <div className="container">
          <div>
            <h3>Export Identity</h3>
            <p>Export your identity to another address.</p>
            <InputGroup label="Recipient address" placeholder="Recipient address" />
            <div>
              <button className="btn btn-primary">Send</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ExportPage