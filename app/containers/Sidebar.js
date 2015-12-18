import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

export default class Sidebar extends Component {
  constructor() {
    super()
  }

  render() {
    return (
      <ul className="nav nav-sidebar">
        <li>
          <Link to="/profile/ryan.id">
            ryan.id
          </Link>
        </li>
        <li>
          <Link to="/profile/muneeb.id">
            muneeb.id
          </Link>
        </li>
        <li>
          <Link to="/profile/guylepage3.id">
            guylepage3.id
          </Link>
        </li>
        <li>
          <Link to="/profile/judecn.id">
            judecn.id
          </Link>
        </li>
        <li>
          <Link to="/profile/naval.id">
            naval.id
          </Link>
        </li>
        <li>
          <Link to="/profile/albertwenger.id">
            albertwenger.id
          </Link>
        </li>
        <li>
          <Link to="/profile/fredwilson.id">
            fredwilson.id
          </Link>
        </li>
        <li>
          <Link to="/register">
            Register
          </Link>
        </li>
        <li>
          <Link to="/import">
            Import
          </Link>
        </li>
      </ul>
    )
  }
}
