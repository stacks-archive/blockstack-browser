import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

export default class Sidebar extends Component {
  constructor() {
    super()
  }

  render() {
    return (
      <ul className="nav">
        <li className="nav-item">
          <Link to="/profile/ryan.id" className="nav-link">
            ryan.id
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/profile/muneeb.id" className="nav-link">
            muneeb.id
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/profile/guylepage3.id" className="nav-link">
            guylepage3.id
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/profile/judecn.id" className="nav-link">
            judecn.id
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/profile/naval.id" className="nav-link">
            naval.id
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/profile/albertwenger.id" className="nav-link">
            albertwenger.id
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/profile/fredwilson.id" className="nav-link">
            fredwilson.id
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/register" className="nav-link">
            Register
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/import" className="nav-link">
            Import
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/register" className="nav-link">
            Register
          </Link>
        </li>
      </ul>
    )
  }
}
