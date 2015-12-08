import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

class Header extends Component {
  static propTypes = {
  }

  render() {
    return (
      <div>
        <div className="header">
          <div className="header-container">
            <ul className="nav">
              <li>
                <Link to="/profile" className="navbar-toggle">
                  <img src="images/users-32px-outline_single-03.svg"
                    className="nav-icon"/>
                </Link>
              </li>
            </ul>
            <ul className="nav">
              <li>
                <Link to="/update" className="navbar-toggle">
                  <img src="images/design-32px-outline_pen-01.svg"
                    className="nav-icon"/>
                </Link>
              </li>
            </ul>
            <ul className="nav">
              <li>
                <Link to="/settings" className="navbar-toggle">
                  <img src="images/ui-32px-outline-1_settings-gear-64.svg"
                    className="nav-icon"/>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default Header
