import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

export default class ImportPage extends Component {
  constructor() {
    super()
  }

  render() {
    return (
      <div>
        <div>
          <h3>Import Identity</h3>

          <p>Send the identity to the following address:</p>

          <div className="highlight">
            <pre>
              <code>1HHasDGXWg7vV9QdUe7BJWoJykaBmmLyw4</code>
            </pre>
          </div>

          <div>
            <button className="btn btn-primary">Generate New Address</button>
          </div>
        </div>
      </div>
    )
  }
}
