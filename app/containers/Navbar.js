import React, { Component, PropTypes } from 'react'
import { Link, History } from 'react-router'
import { BackButton, ForwardButton } from '../components/Buttons'

export default class Navbar extends Component {
  static propTypes = {
  }

  render() {
    return (
      <nav className="navbar navbar-nav navbar-fixed-top navbar-light bg-faded">
        <div className="nav-item nav-link">
          <BackButton>
            <img src="images/icon-nav-previous.svg"/>
          </BackButton>
        </div>
        <div className="nav-item nav-link">
          <ForwardButton>
            <img src="images/icon-nav-next.svg"/>
          </ForwardButton>
        </div>
        <div className="nav-item nav-search">
          <form className="form-inline">
            <input className="form-control form-control-sm" type="text" placeholder="search" />
          </form>
        </div>
        <div className="nav-item nav-link pull-xs-right">
          <Link to="/settings">
            <img src="images/ui-32px-outline-1_settings-gear-64.svg"
              className="nav-icon"/>
          </Link>
        </div>
        <div className="nav-item nav-link pull-xs-right">
          <Link to="/notifications">
            <img src="images/design-32px-outline_bullet-list-67.svg"
              className="nav-icon"/>
          </Link>
        </div>
      </nav>
    )
  }
}
