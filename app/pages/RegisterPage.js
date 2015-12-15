import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import InputGroup from '../components/InputGroup'

export default class RegisterPage extends Component {
  constructor() {
    super()
  }

  render() {
    return (
      <div>
        <div>
          <h3>Register Identity</h3>

          <InputGroup label="Username" placeholder="Username" />

          <div>
            <label>Cost</label>

            <pre><code>$2</code></pre>

            <p><i>Note: this amount will be pulled from your local Bitcoin balance.</i></p>
          </div>

          <div>
            <button className="btn btn-primary">Register</button>
          </div>
        </div>
      </div>
    )
  }
}
