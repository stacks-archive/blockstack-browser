import React, { Component, PropTypes } from 'react'
import { Link, History } from 'react-router'
import { BackButton, ForwardButton } from '../components/Buttons'
import SearchBar from './SearchBar'

class Navbar extends Component {
  static propTypes = {
  }

  render() {
    return (
      <nav className="navbar navbar-light bg-faded navbar-fixed-top">
        <div className="nav navbar-nav">
          <div className="pull-xs-left back-forth">
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
          
          <div className="pull-xs-right toolbar">
            <div className="nav-item nav-link">
              <Link to="/identities">
                <img src="images/icon-identity.svg"/>
                <span className="icon-labels">Identities</span>
              </Link>
            </div>
            <div className="nav-item nav-link">
              <Link to="/bookmarks">
                <img src="images/icon-bookmark-24px.svg"/>
                <span className="icon-labels">Bookmarks</span>
              </Link>
            </div>
            <div className="nav-item nav-link">
              <Link to="/deposit">
                <img src="images/icon-dollar-circle.svg"/>
                <span className="icon-labels">Funds</span>
              </Link>
            </div>
            <div className="nav-item nav-link">
              <Link to="/settings">
                <img src="images/icon-settings.svg"/>
                <span className="icon-labels">Settings</span>
              </Link>
            </div>
            
          </div>
          <div className="nav-search">
            <div className="nav-link">
              <form className="form-group">
                <SearchBar placeholder="Search the blockchain"
                  resultCount={12} />
              </form>
            </div>
          </div>
        </div>
      </nav>
    )
  }
}

export default Navbar