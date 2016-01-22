import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import InputGroup from '../components/InputGroup'

class RestorePage extends Component {
  constructor() {
    super()
  }

  render() {
    return (
      <div>
        <h3>Restore Account</h3>
        <InputGroup label="Backup phrase" placeholder="Backup phrase" />
        <div>
          <button className="btn btn-primary">Restore</button>
        </div>
        <hr />
        <p>
          Don't have an account?
          <br />
          <Link to="/landing">Create an account</Link>
        </p>
      </div>
    )
  }
}

export default RestorePage