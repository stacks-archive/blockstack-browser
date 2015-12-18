import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

export default class BackupPage extends Component {
  constructor() {
    super()
  }

  render() {
    return (
      <div>
        <div>
          <h2>Backup Account</h2>

          <p>
            <b>Write down the words below and keep them in a safe place</b>

            &nbsp;(they will allow you to restore your account).
          </p>

          <div className="highlight">
            <pre>
              <code>cat dog mouse car tree stove kitten power waffle muffin burger pickle</code>
            </pre>
          </div>

          <p>
            Anyone with your phrase can access your account.
            Once written down, delete any record of it from this app.
          </p>

          <div>
            <button className="btn btn-primary">I saved the phrase - delete this copy</button>
          </div>
        </div>
      </div>
    )
  }
}
