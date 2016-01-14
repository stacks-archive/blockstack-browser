import React, { Component, PropTypes } from 'react'
import { Link, History } from 'react-router'
import { BackButton, ForwardButton } from '../components/Buttons'

export default class Navbar extends Component {
  static propTypes = {
  }

  render() {
    return (
      <nav className="navbar navbar-light bg-faded navbar-fixed-top">
        <div className="nav navbar-nav">
          <div className="pull-xs-left">
            <div className="nav-item nav-link">
              <BackButton>
                <img src="images/icon-previous.svg"/>
              </BackButton>
            </div>
            <div className="nav-item nav-link">
              <ForwardButton>
                <img src="images/icon-next.svg"/>
              </ForwardButton>
            </div>
          </div>
          
          <div className="pull-xs-right">
            <div className="nav-item nav-link">
              <Link to="/settings">
                <img src="images/ui-32px-outline-1_settings-gear-64.svg"
                  className="nav-icon"/>
              </Link>
            </div>
            <div className="nav-item nav-link">
              <Link to="/notifications">
                <img src="images/design-32px-outline_bullet-list-67.svg"
                  className="nav-icon"/>
              </Link>
            </div>
          </div>
          <div className="nav-search ">
            <div className="nav-link">
              <form className="form-group">
                <input className="form-control form-control-sm" type="text" placeholder="search" />
              </form>
            </div>
          </div>
        </div>
      </nav>
    )
  }
}
