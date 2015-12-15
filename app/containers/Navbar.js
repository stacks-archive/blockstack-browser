import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

export default class Navbar extends Component {
  static propTypes = {
  }

  render() {
    return (
      <nav className="navbar navbar-default navbar-fixed-top">
        <div className="container-fluid">
          <div className="navbar-header">
          </div>
          <div className="navbar-collapse collapse">
            <ul className="nav navbar-nav navbar-right">
              <li>
                <Link to="/settings">
                  <img src="images/ui-32px-outline-1_settings-gear-64.svg"
                    className="nav-icon"/>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    )
  }
}
