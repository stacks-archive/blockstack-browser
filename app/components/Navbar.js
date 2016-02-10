import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import BackButton from '../components/BackButton'
import ForwardButton from '../components/ForwardButton'
import AddressBar from './AddressBar'

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
          <div className="pull-xs-right browser-links">
            <div className="nav-item nav-link">
              <Link to="/">
                <img src="images/icon-home.svg"/>
                <span className="icon-labels">Home</span>
              </Link>
            </div>
            <div className="nav-item nav-link">
              <Link to="/account/deposit">
                <img src="images/icon-cog.svg"/>
                <span className="icon-labels">Account</span>
              </Link>
            </div>
            
          </div>
          <div className="nav-search">
            <div className="nav-link">
              <AddressBar placeholder="Search the blockchain" timeout={500} />
            </div>
          </div>
        </div>
      </nav>
    )
  }
}

export default Navbar