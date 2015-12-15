import React, { Component, PropTypes } from 'react'
import { Link, History } from 'react-router'
import { BackButton, ForwardButton } from '../components/Buttons'

export default class Navbar extends Component {
  static propTypes = {
  }

  render() {
    return (
      <nav className="navbar navbar-default navbar-fixed-top">
          <div className="navbar-table">
            <div className="navbar-tab navbar-1-12-tab">
              <BackButton >
                &lt;
              </BackButton>
              <ForwardButton>
                &gt;
              </ForwardButton>
            </div>
            <div className="navbar-tab navbar-10-12-tab">
                <input className="form-control" placeholder="search" />
            </div>
            <div className="navbar-tab navbar-1-12-tab right-navbar">
              <Link to="/notifications">
                <img src="images/design-32px-outline_bullet-list-67.svg"
                  className="nav-icon"/>
              </Link>

              <Link to="/settings">
                <img src="images/ui-32px-outline-1_settings-gear-64.svg"
                  className="nav-icon"/>
              </Link>
            </div>
          </div>
      </nav>
    )
  }
}
